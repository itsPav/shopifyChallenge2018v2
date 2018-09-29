import React, { Component } from 'react';

export default class Repo extends Component {

    constructor(props) {
        super(props);
        this.componentWillReceiveProps = this.componentWillReceiveProps.bind(this);

        this.state = {
          nameWithOwner: '',
          primaryLanguage: '',
          tagName: '',
          added: false,
          favourite: false
        }
    }

    componentWillMount () {
        this.setState({
            nameWithOwner: this.props.data.node.nameWithOwner,
            primaryLanguage: this.props.data.node.primaryLanguage ? this.props.data.node.primaryLanguage.name : null,
            tagName: this.props.data.node.releases.nodes.length > 0 ? this.props.data.node.releases.nodes[0].name : "-",
            added: this.props.added ? null : 'Add',
            favourite: this.props.favourite ? 'Remove' : null   
        })
    }

    componentWillReceiveProps({added, favourite}) {
        this.setState({
            added: added ? null : 'Add',
            favourite: favourite ? 'Remove' : null   
        })
    }

    addToFavorites = () => {
        if(!this.props.added && !this.props.favourite) {
            this.setState({
                added: true,
                favourite: true
            })
            // send data to favorites and create a repo there
            this.props.addFavourites(this.props.data);
        }
    }

    removeFromFavourites = () => {
        // send data to remove from favourites
        this.props.removeFavourites(this.props.data);
    }

    handleClick = () => {
        this.addToFavorites();
        if(this.state.favourite) {
            this.removeFromFavourites();
        }
    }

    handleKeyPress = (event) => {
        if(event.key === 'Enter') {
            this.handleClick();
        }
    }

    render() {
        return (
            <tr className="">
                <td className="td-left" tabIndex={0}>{this.state.nameWithOwner}</td>
                <td className="tdWidth">{this.state.primaryLanguage}</td>
                <td className="tdWidth">{this.state.tagName}</td>
                <td className="add td-right" 
                    tabIndex={0} 
                    onClick={this.handleClick}
                    onKeyPress={this.handleKeyPress}>
                    {this.state.added} {this.state.favourite}
                </td>
            </tr>
        );
    }
};