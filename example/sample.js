import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import ScrollUpIndicator from './../index';

class SampleComponent extends React.Component {
    render() {
        return (
            <div className="sample">
                <ScrollUpIndicator className="indicator" activeClassName="indicator--active">
                    UP
                </ScrollUpIndicator>
            </div>
        );
    }
}

ReactDOM.render(<SampleComponent />, document.getElementById('app'));