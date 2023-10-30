import React, { Component } from "react";
import { Responsive, WidthProvider } from "react-grid-layout";
import LayoutCard from "../LayoutCard/LayoutCard";
import DisplayProject from "../ManageTasks/DisplayProject";
import Card from '@mui/material/Card';
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
            occupied: {"0,1": "a", "0,2": "a", "10,0": "c", "10,1": "c", "10,2": "empty"},
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
        
        let occupiedPositions = { ...this.state.occupied };
        const newLayout = [...layout];
    
        const getOccupiedKey = (x, y) => `${x},${y}`;
        
        const moveItemsFromNewPosToOldPos = (startY, endY) => {
            for (let y = startY; y <= endY; y++) {
                const newPosKey = getOccupiedKey(closestX, y);
                if (occupiedPositions[newPosKey] && occupiedPositions[newPosKey] !== "empty") {
                    const occupyingItem = newLayout.find(item => item.i === occupiedPositions[newPosKey]);
                    occupyingItem.y += (oldItem.y - closestY);
                    occupiedPositions[getOccupiedKey(occupyingItem.x, occupyingItem.y)] = occupyingItem.i;
                }
            }
        };
    
        // Handle items with height of 2
        if (newItem.h === 2) {
            moveItemsFromNewPosToOldPos(closestY, closestY + 1);
        } else {
            const newPosKey = getOccupiedKey(closestX, closestY);
            if (occupiedPositions[newPosKey] && occupiedPositions[newPosKey] !== "empty") {
                const occupyingItem = newLayout.find(item => item.i === occupiedPositions[newPosKey]);
                occupyingItem.x = oldItem.x;
                occupyingItem.y = oldItem.y;
                occupiedPositions[getOccupiedKey(oldItem.x, oldItem.y)] = occupyingItem.i;
            }
        }
    
        // Update the dragged item's position
        const draggedItem = newLayout.find(item => item.i === newItem.i);
        draggedItem.x = closestX;
        draggedItem.y = closestY;
        occupiedPositions[getOccupiedKey(closestX, closestY)] = draggedItem.i;
    
        if (newItem.h === 2) {
            occupiedPositions[getOccupiedKey(closestX, closestY + 1)] = draggedItem.i;
        }
    
        this.setState({ layout: newLayout, occupied: occupiedPositions });
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
        margin={[45, 45, 45]}
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
        <Card key="a" variant="outlined" style={{marginRight: "100px !important"}}>
            <LayoutCard content={() => {return this.state.projects && this.state.projects.length > 0 ? (
                                                        <DisplayProject projects={this.state.projects} /> ) : (
                                                        <span>Loading...</span>
                                                        )}} />
        </Card>
        <Card key="b" variant="outlined">
            <LayoutCard color={"green"} content={() => {return this.state.projects && this.state.projects.length > 0 ? (
                                                        <DisplayProject projects={this.state.projects} /> ) : (
                                                        <span>Loading...</span>
                                                        )}} />
        </Card>
        <Card key="c" variant="outlined">
            <LayoutCard color={"red"} content={() => {return this.state.projects && this.state.projects.length > 0 ? (
                                                        <DisplayProject projects={this.state.projects} /> ) : (
                                                        <span>Loading...</span>
                                                        )}} />
        </Card>
        </ResponsiveGridLayout>
    </div>
    );
  }
}