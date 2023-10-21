import React, { Component } from "react";
import { Responsive, WidthProvider } from "react-grid-layout";
import LayoutCard from "../LayoutCard/LayoutCard";
const ResponsiveGridLayout = WidthProvider(Responsive);


export default class DashboardLayout extends Component {
    state = {
        value: true,
        loaded: false,
        layout: [
            { i: "a", x: 0, y: 0, w: 4, h: 1 },
            { i: "b", x: 0, y: 1, w: 4, h: 1 },
            { i: "c", x: 10, y: 2, w: 4, h: 1 }
        ],
        snapPointsX: [0,10],
        snapPointsY: [0, 1, 2],
        occupied: {"0,1": "a", "0,2": "b", "10,0": "empty", "10,1": "empty", "10,2": "c"}
    };

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

        // Find and update the item in your layout and set the state
        /*const newLayout = layout.map(item => 
            item.i === newItem.i 
            ? { ...item, x: closestX, y: closestY } 
            : item
        );*/

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
            <LayoutCard color={"yellow"} />
        </div>
        <div key="b" style={{ backgroundColor: "green" }}>
            <LayoutCard color={"green"} />
        </div>
        <div key="c" style={{ backgroundColor: "red" }}>
            <LayoutCard color={"red"} />
        </div>
        </ResponsiveGridLayout>
    </div>
    );
  }
}