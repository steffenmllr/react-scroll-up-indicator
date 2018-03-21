import React, { Component } from 'react';
import PropTypes from 'prop-types';
import smoothscroll from 'smoothscroll-polyfill';
import raf from 'raf';

const canUseDOM = !!(typeof window !== 'undefined' && window.document && window.document.createElement);
const getScrollDelta = (previousState, y) => {
    const diff = y - previousState.y;
    const delta = Math.abs(previousState.delta) < Math.abs(previousState.delta + diff) ? previousState.delta + diff : diff;
    return {
        delta,
        y
    };
};

const getScrollPosition = () => {
    const scrollTop = pageYOffset !== undefined ? pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;
    return scrollTop < 0 ? 0 : scrollTop;
};

class ReactScrollUpIndicator extends React.Component {
    constructor(props) {
        super(props);
        this.firstScroll = true;
        this.state = {
            active: false
        };
    }

    componentDidMount() {
        if (canUseDOM) {
            smoothscroll.polyfill();
            window.addEventListener('scroll', this.onScroll.bind(this), false);
        }
    }

    componentWillUnmount() {
        if (canUseDOM) {
            window.removeEventListener('scroll', this.onScroll);
        }
    }

    scrollUp(e) {
        e.preventDefault();
        window.scroll({
            top: 0,
            left: 0,
            behavior: 'smooth'
        });
    }

    onScroll() {
        if (this.firstScroll) {
            this.scrollState = {
                delta: 0,
                y: getScrollPosition()
            };
            this.firstScroll = false;
        }

        if (this.isScrolling) {
            return false;
        }

        this.isScrolling = true;
        raf(() => {
            this.scrollState = getScrollDelta(this.scrollState, getScrollPosition());
            this.isScrolling = false;
            if (this.scrollState.delta < -this.props.distance) {
                this.setState({ active: true });
            }

            if (this.scrollState.delta > this.props.distance || this.props.hideAlways >= this.scrollState.y) {
                this.setState({ active: false });
            }
        });
    }

    render() {
        const { className, activeClassName } = this.props;
        const { active } = this.state;
        const itemClass = `${className} ${active ? activeClassName : ''}`;
        return (
            <div className={itemClass} onClick={this.scrollUp.bind(this)}>
                {this.props.children}
            </div>
        );
    }
}

ReactScrollUpIndicator.defaultProps = {
    distance: 20,
    hideAlways: 500,
    className: 'indicator',
    activeClassName: 'indicator--inactive'
};

ReactScrollUpIndicator.propTypes = {
    distance: PropTypes.number.isRequired,
    hideAlways: PropTypes.number.isRequired,
    activeClassName: PropTypes.string.isRequired,
    behavior: PropTypes.string.isRequired,
    className: PropTypes.string.isRequired
};

export default ReactScrollUpIndicator;