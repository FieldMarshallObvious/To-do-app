import React, { Component } from 'react'

import styles from "./LayoutCard.module.css"

export default class DashboardLayoutComponent extends Component {
    
    render() {
        const contentOutput = this.props.content();
        console.log('Content function output:', contentOutput);
       // console.log('props:', this.props.content)
        return (
            <div>
                {this.props.content()}
            </div>
        )
    }
}