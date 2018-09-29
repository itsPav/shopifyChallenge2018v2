import React, { Component } from 'react';
import axios from 'axios';
import apiKey from '../config';

import Header from './Header';
import SearchForm from './SearchForm';
import Results from './Results';
import Favourites from './Favourites';

export default class Main extends Component {

    constructor(props) {
        super(props);
        this.addFavourites = this.addFavourites.bind(this);
        this.removeFavourites = this.removeFavourites.bind(this);

        this.state = {
          repos: [],
          favourites: JSON.parse(sessionStorage.getItem('favourites')) || [],
          favTracker: JSON.parse(sessionStorage.getItem('favTracker')) || [],
          isLoading: false
        }
      }

      performSearch = (query) => {
        axios({
          url: `https://api.github.com/graphql`,
          method: 'post',
          headers: { "Authorization": "bearer " + apiKey},
          data: {
            query: `{
              search(query: "${query}", type: REPOSITORY, first: 10) {
                repositoryCount
                edges {
                  node {
                    ... on Repository {
                      nameWithOwner
                      url
                      primaryLanguage {
                        name
                      }    
                      releases(last: 1) {
                        nodes {
                          name
                        }
                      }  
                    }
                  }
                }
              }
            }`
          }

        }).then(response => {
          if(query.length > 0) {
            console.log(response.data.data.search.edges);
          }
          this.setState({
            repos: response.data.data.search.edges,
            isLoading: false
          })
        })
        .catch(error => { 
          console.log('Error fetching and parsing data', error);
        });
      }

      addFavourites(data) {
        var newStateArray = this.state.favourites;
        var favTracker = this.state.favTracker;

        if(favTracker.indexOf(data.node.url) === -1) {
          newStateArray.push(data);
          favTracker.push(data.node.url);
        }

        this.setState({
          favourites: newStateArray,
          favTracker: favTracker
        });

        this.updateLocalStorage();
      }

      updateLocalStorage() {
        sessionStorage.setItem('favourites', JSON.stringify(this.state.favourites));
        sessionStorage.setItem('favTracker', JSON.stringify(this.state.favTracker));
      }

      getLocalStorage() {

      }

      removeFavourites(data) {
        var newStateArray = this.state.favourites;
        var favTracker = this.state.favTracker;

        // console.log(newStateArray);
        // console.log(favTracker);

        var index = favTracker.indexOf(data.node.url);
        if (index > -1) {
          favTracker.splice(index, 1);
          newStateArray.splice(index,1);
        }

        this.setState({
          favourites: newStateArray,
          favTracker: favTracker
        });

        this.updateLocalStorage();
      }

      render() {
        return (
          <div>
            <Header />
            <div className="mainArea">
                <div className="searchArea">
                    <SearchForm performSearch={this.performSearch}/>
                    { (this.state.isLoading) 
                        ? <h1>Searching...</h1> 
                        : <Results repos={this.state.repos} 
                        addFavourites={this.addFavourites} 
                        removeFavourites={this.removeFavourites} 
                        favTracker={this.state.favTracker}/>
                    }
                </div>
                <div className="favArea">
                    <Favourites favourites={this.state.favourites} 
                                addFavourites={this.addFavourites} 
                                removeFavourites={this.removeFavourites} 
                                favTracker={this.state.favTracker}/>
                </div>
            </div>
          </div>
        );
      }
}