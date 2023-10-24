import React, { Component } from "react";
import { Responsive, WidthProvider } from "react-grid-layout";
import LayoutCard from "../LayoutCard/LayoutCard";
import DisplayProject from "../ManageTasks/DisplayProject";
const ResponsiveGridLayout = WidthProvider(Responsive);


export default class DashboardLayout extends Component {
    constructor(props) {
        super(props)
        this.onDragStop = this.onDragStop.bind(this);
        this.state = {
            value: true,
            loaded: false,
            layout: props.layout,
            snapPointsX: [0,10],
            snapPointsY: [0, 1, 2],
            occupied: {"0,1": "a", "0,2": "b", "10,0": "empty", "10,1": "empty", "10,2": "c"},
            projects: props.projects
        };
    }

    componentDidUpdate(prevProps)  {
        if (this.props.projects !== prevProps.projects) {
            this.setState({ projects: this.props.projects });
        }
    }



    getClosest = (num, arr) => {
        let curr = arr[0];
        arr.forEach(val => {
            if (Math.abs(num - val) < Math.abs(curr - num)) {
                curr = val;
            }
        });
        return curr;
    };

    onDragStop = (layout, oldItem, newItem, placeholder, e, element) => {

        e.preventDefault();

        const closestX = this.getClosest(newItem.x, this.state.snapPointsX);
        const closestY = this.getClosest(newItem.y, this.state.snapPointsY);
        const newPos = `${closestX},${closestY}`

        const oldX = layout.find(item => item.i === newItem.i).x;
        const oldY = layout.find(item => item.i === newItem.i).y;
        const oldPos = `${oldX},${oldY}`

        let occupiedPositions = this.state.occupied;

        const newLayout = [...layout];

        if (occupiedPositions[newPos] && occupiedPositions[oldPos] !== "empty") {
            // Find the item that currently occupies the spot
            const occupyingItemIndex = newLayout.findIndex(item => item.i === occupiedPositions[newPos]);
    
            // If found, swap positions
            if (occupyingItemIndex !== -1) {
                console.log("Found occupied item: ", newLayout[occupyingItemIndex])
                newLayout[occupyingItemIndex].x = oldItem.x; // Old item's X position
                newLayout[occupyingItemIndex].y = oldItem.y; // Old item's Y position
                occupiedPositions[oldPos] = occupiedPositions[newPos]; // Update occupied position
            }
        }
    
        // Update the dragged item's position
        const draggedItemIndex = newLayout.findIndex(item => item.i === newItem.i);
        if (draggedItemIndex !== -1) {
            newLayout[draggedItemIndex].x = closestX;
            newLayout[draggedItemIndex].y = closestY;
            occupiedPositions[newPos] = newItem.i; // Update occupied position
        }

        occupiedPositions = newLayout.reduce((acc, item) => {
            const positionKey = `${item.x},${item.y}`;
            acc[positionKey] = item.i;
            return acc;
        }, {});
    
        // Fill in the 'empty' spaces in the occupied positions
        Object.keys(this.state.occupied).forEach(key => {
            if (!occupiedPositions.hasOwnProperty(key)) {
                occupiedPositions[key] = "empty";
            }
        });
        
        console.log("New Occupied Positions: ", occupiedPositions); 
        
        this.setState({ layout: newLayout , occupied: occupiedPositions});

        this.props.updateParentLayout(newLayout);
    };

    render = () => {


    return (
    <div>
        <ResponsiveGridLayout
        className="layout"
        layouts={{lg: this.state.layout}}
        breakpoints={{ lg: 1200 }}
        cols={{ lg: 12 }}
        rowHeight={281}
        width={1200}
        onDragStop={this.onDragStop} 
        onLayout={(event) => {
            event.target.measure(
                (x, y, width, height, pageX, pageY) => {
                    console.log("x: ", x);
                    console.log("y: ", y);
                    console.log("event is ", event)
                },
              );            
        }}
        draggableCancel="input,textarea,button,select,optgroup"
        >
        <div key="a" style={{ backgroundColor: "yellow" }}>
            <LayoutCard content={() => {return this.state.projects && this.state.projects.length > 0 ? (
                                                        <DisplayProject projects={this.state.projects} /> ) : (
                                                        <span>Loading...</span>
                                                        )}} />
        </div>
        <div key="b" style={{ backgroundColor: "green" }}>
            <LayoutCard color={"green"} content={() => {return this.state.projects && this.state.projects.length > 0 ? (
                                                        <DisplayProject projects={this.state.projects} /> ) : (
                                                        <span>Loading...</span>
                                                        )}} />
        </div>
        <div key="c" style={{ backgroundColor: "red" }}>
            <LayoutCard color={"red"} content={() => {return this.state.projects && this.state.projects.length > 0 ? (
                                                        <DisplayProject projects={this.state.projects} /> ) : (
                                                        <span>Loading...</span>
                                                        )}} />
        </div>
        </ResponsiveGridLayout>
    </div>
    );
  }
}