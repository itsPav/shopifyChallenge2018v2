import React from 'react';
import Repo from './Repo';

const Favourites = props => {
    const faves = props.favourites;
    const favourite = true;
    const added = true;

    let rows = faves.map(repo => 
        <Repo key={repo.node.url} data={repo} removeFavourites={props.removeFavourites} favourite={favourite} added={added}/>
    )

    return(
            <table className="">
                <thead>
                    <tr className="heading">
                        <th className="td-left">Name</th>
                        <th className="tdWidth">Language</th>
                        <th className="tdWidth">Latest Tag</th>
                        <th className="td-right"></th>
                    </tr>
                </thead>
                <tbody>
                {rows}
                </tbody>
            </table>
    );
};

export default Favourites;