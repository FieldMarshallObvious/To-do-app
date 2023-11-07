import React, { Component } from "react";
import { Responsive, WidthProvider } from "react-grid-layout";
import LayoutCard from "../LayoutCard/LayoutCard";
import DisplayProject from "../ManageTasks/DisplayProject";
import { Row, Button } from 'react-bootstrap';
import { ThreeDots } from "react-bootstrap-icons";
import Card from '@mui/material/Card';
import styles from './DashboardLayout.module.css';
import DashboardCardSettings from './DashboardCardSettings';
import { UserContext } from "../../contexts/UserContext";



const ResponsiveGridLayout = WidthProvider(Responsive);


export default class DashboardLayout extends Component {
    static contextType = UserContext;

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
            projects: props.projects,
            locked: props.locked,
            settingsVisibility: {
                a: false,
                b: false,
                c: false
            },
            showProjectModal: this.props.showProjectModal,
        };
    }

    componentDidMount() {
        this.setState({ ... this.state, context: this.context });
    }

    componentDidUpdate(prevProps)  {
        if (this.props.projects !== prevProps.projects) {
            this.setState({ projects: this.props.projects });
        }

        if (this.props.locked !== prevProps.locked) {
            this.setState({ locked: this.props.locked });

            if (!this.props.locked) { 
                this.setState({ settingsVisibility: {
                    a: false,
                    b: false,
                    c: false
                }});
             }
        }

        if ( this.props.showProjectModal !== prevProps.showProjectModal) {
            this.setState({ showProjectModal: this.props.showProjectModal });
        }
    }

    getFilteredProjects = (cardKey) => {
        const { projects } = this.state;
        const selectedProjects = this.context.cardSettings[cardKey].selectedProjects;

        // If 'all' is selected, return all projects.
        if (selectedProjects.includes('all')) {
          return projects;
        }
        // Filter projects based on selected titles.
        const filteredProjects = projects.filter(project => 
            selectedProjects.includes(project.Title)
        );

        return filteredProjects;
      };

    updatedSettings = (cardKey, newSettings) => {
        this.context.setCardSettings(prevState => ({
            ...prevState,
            [cardKey]: {
              ...newSettings
            }
        }));
    }

    toggleSettings = (card) => {
        let settingsVisibility = {...this.state.settingsVisibility};
        settingsVisibility[card] = !settingsVisibility[card];
        this.setState({ settingsVisibility: settingsVisibility });
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
        isDraggable={this.state.locked} 
        onLayout={(event) => {
            event.target.measure(
                (x, y, width, height, pageX, pageY) => {
                    console.log("x: ", x);
                    console.log("y: ", y);
                    console.log("event is ", event)
                },
              );            
        }}
        draggableCancel="input,textarea,button,select,optgroup">
        {Object.keys(this.state.settingsVisibility).map(cardKey => (
            <Card key={cardKey} variant="outlined" style={{overflowY: "scroll"}}>
                {this.state.locked ?
                    <Row className="mx-auto" style={{ position: 'fixed', right: 0, top: 0, zIndex: 2 }}>
                        <Button
                            className={`${styles.editCardButton}`}
                            variant="outline-secondary"
                            onClick={() => this.toggleSettings(cardKey)} // Pass the card key to the toggle method
                        >
                            <ThreeDots size={20}/>
                        </Button>
                    </Row> : null
                }
                {/* Conditionally render DashboardCardSettings or LayoutCard based on the state */}
                    {this.state.settingsVisibility[cardKey] ? (
                    <div style={{paddingLeft: "10px"}}>
                    <Row className={`mx-auto ${styles.invisibleButton}`}>
                    <Button
                        className={`${styles.editCardButton}`}
                        variant="outline-secondary"
                        onClick={() => this.toggleSettings(cardKey)}
                    >
                        <ThreeDots size={20}/>
                    </Button>
                    </Row>

                    <DashboardCardSettings
                        allProjects={this.state.projects}  
                        settings={this.context.cardSettings[cardKey]}
                        updateSettings={(newSettings) => this.updatedSettings(cardKey, newSettings)}
                        style={{zIndex: 2}}
                    />
                    </div>
                ) : (
                    <LayoutCard color={cardKey} content={() => {
                        const filteredProjects = this.getFilteredProjects(cardKey);
                        return this.state.projects && this.state.projects.length > 0 ? (
                            filteredProjects.length > 0 ? (
                                <DisplayProject projects={filteredProjects} 
                                                showProjectModal={this.state.showProjectModal} 
                                                setShowProjectModal={this.props.setShowProjectModal} 
                                                isEditing={this.state.locked}/>
                            ) : ( <span>No projects selected</span>  )
                        ) : (
                            <span>Loading...</span>
                        );
                    }} />
                )}
            </Card>
        ))}
        </ResponsiveGridLayout>
    </div>
    );
  }
}