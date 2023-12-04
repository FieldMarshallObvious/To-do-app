import React, { Component } from "react";
import { Responsive, WidthProvider } from "react-grid-layout";
import LayoutCard from "../LayoutCard/LayoutCard";
import DisplayProject from "../ManageTasks/DisplayProject";
import { Row, Button } from 'react-bootstrap';
import { ThreeDots, Plus, Trash } from "react-bootstrap-icons";
import Card from '@mui/material/Card';
import styles from './DashboardLayout.module.css';
import DashboardCardSettings from './DashboardCardSettings';
import { UserContext } from "../../contexts/UserContext";
import { isObjectsEqual } from "../../utils/ObjectUtils";
import ChartComponent from '../TaskChart/ChartComponents';
import CalendarWidget from "../TaskChart/CalendarWidget";

const ResponsiveGridLayout = WidthProvider(Responsive);


export default class DashboardLayout extends Component {
    static contextType = UserContext;

    constructor(props) {
        super(props)
        this.onDragStop = this.onDragStop.bind(this);
        this.state = {
            value: true,
            loaded: false,
            edited: false,
            oldSnapPointsX: [0, 10],
            oldSnapPointsY: [0, 1, 2],
            oldLayout: [{ i: "a", x: 0, y: 0, w: 6, h: 2 },
                        { i: "b", x: 10, y: 0, w: 6, h: 1 },
                        { i: "c", x: 10, y: 2, w: 6, h: 1 }],
            occupied: {"0,1": "a", "0,2": "a", "10,0": "c", "10,1": "c", "10,2": "empty"},
            projects: props.projects,
            locked: props.locked,
            settingsVisibility: {
                a: false,
                b: false,
                c: false
            },
            previouSettings: {
                "a": {
                    displayOption: "projects",
                    selectedProjects: ["all"]
                },
                "b": {
                    displayOption: "projects",
                    selectedProjects: ["all"]
                },
                "c": {
                    displayOption: "projects",
                    selectedProjects: ["all"]
                }
          },
            showProjectModal: this.props.showProjectModal,
        };
    }

    componentDidMount() {
        this.setState({ ... this.state, context: this.context });
    }

    componentDidUpdate(prevProps, prevState) {
        const newState = {};
    
        if (this.props.projects !== prevProps.projects) {
            newState.projects = this.props.projects;
        }
    
        if (this.props.locked !== prevProps.locked) {
            newState.locked = this.props.locked;
    
            if (!this.props.locked) { 
                newState.settingsVisibility = { a: false, b: false, c: false };
                newState.edited = false; 
            }

            if (!this.props.locked && this.state.edited) {
                this.context.setCardSettings(this.state.previouSettings)
                this.context.setLayout(this.state.oldLayout)
                this.setState({ edited: false })
            }
        }

        if ( (!isObjectsEqual(this.context.layout, prevState.oldLayout) || 
              !isObjectsEqual(this.context.cardSettings, prevState.previouSettings)) && 
               !this.props.locked) {
                newState.oldLayout = this.context.layout;
                newState.previouSettings = this.context.cardSettings;  
                newState.occupied = this.computeOccupiedPositions(this.context.layout);
        }
    
        if (this.props.showProjectModal !== prevProps.showProjectModal) {
            newState.showProjectModal = this.props.showProjectModal;
        }
    
        if (Object.keys(newState).length > 0) {
            this.setState(newState);
        }
    }
    

    getFilteredProjects = (cardKey) => {
        const { projects } = this.state;
        const selectedProjects = this.context.cardSettings[cardKey].selectedProjects ? this.context.cardSettings[cardKey].selectedProjects : 'all';

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

    computeOccupiedPositions(layout) {
        let occupied = {};
        layout.forEach(item => {
            // Assuming each item has an 'x', 'y', 'w', 'h' (width, height) properties
            for (let x = item.x; x < item.x + item.w; x++) {
                for (let y = item.y; y < item.y + item.h; y++) {
                    occupied[`${x},${y}`] = item.i; // 'i' is the identifier of the item
                }
            }
        });
        return occupied;
    }

    updatedSettings = (cardKey, newSettings) => {
        this.setState({ edited: true });
        this.setState({ previouSettings: this.context.cardSettings });
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

        this.setState({ edited: true });
    
        const closestX = this.getClosest(newItem.x, this.context.snapPoints.x);
        const closestY = this.getClosest(newItem.y, this.context.snapPoints.y);
        
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
    
        this.setState({ occupied: occupiedPositions });
        this.context.setLayout(newLayout);
    };

    addNewCard = (x, y, w = 6, h = 2) => {
        const newCardId = `new_card_${Date.now()}`; 
        const newCardLayout = {
            i: newCardId, 
            x: x, 
            y: y, 
            w: w, 
            h: h,
        };

        this.context.setLayout(previousLayout => [...previousLayout, newCardLayout]);
        this.context.setCardSettings(previousSettings => ({
            ...previousSettings,
            [newCardId]: {
                displayOption: "projects",
                selectedProjects: ["all"]
            }
        }));
        console.log("New Layout: ", this.context.layout);
    };

    deleteCard = (cardId) => {
        // Remove the card from the layout
        const newLayout = this.context.layout.filter(item => item.i !== cardId);
        this.context.setLayout(newLayout);
    
        // Remove the card settings
        const newCardSettings = { ...this.context.cardSettings };
        delete newCardSettings[cardId];
        this.context.setCardSettings(newCardSettings);
    
        // Update the occupied positions if necessary
        const newOccupied = this.computeOccupiedPositions(newLayout);
        this.setState({ occupied: newOccupied, edited: true });
    };

    updateSnapPoints = (x, y) => {
        this.setState(prevState => {
            // Destructure snapPoints from the context for easier access
            const { snapPoints } = this.context;
            
            // Save old snap points in the dashboard layout
            const oldSnapPointsX = snapPoints.x;
            const oldSnapPointsY = snapPoints.y;
            this.setState({ oldSnapPointsX: oldSnapPointsX, oldSnapPointsY: oldSnapPointsY });
    
            // Get the maximum values of the current snap points
            const maxX = Math.max(...snapPoints.x);
            const maxY = Math.max(...snapPoints.y);
    
            // Initialize newSnapPointsX and newSnapPointsY with current snap points
            let newSnapPointsX = snapPoints.x;
            let newSnapPointsY = snapPoints.y;

            console.log("X: ", x)
            console.log("Y: ", y)
            console.log("MaxX: ", maxX)
            console.log("MaxY: ", maxY)
    
            // Update X snap points if new layout exceeds current maxX
            if (x  > maxX) {
                console.log("Calculate new X")
                newSnapPointsX.push(x)
                console.log("New Snap Points X: ", newSnapPointsX)
            }
    
            // Update Y snap points if new layout exceeds current maxY
            if (y > maxY) {
                console.log("Calculate new Y")
                newSnapPointsY.push(y)
                console.log("New Snap Points Y: ", newSnapPointsY)
            }
    
            // Update the context only if there are changes
            if (newSnapPointsX !== snapPoints.x || newSnapPointsY !== snapPoints.y) {
                console.log("Set hook")
                this.context.setSnapPoints({ x: newSnapPointsX, y: newSnapPointsY });
            }

            console.log("New Snap Points: ", this.context.snapPoints)
    
            // Return the updated state
            return { newSnapPointsX, newSnapPointsY };
        });
    };
    

    renderProjectOrChart = (cardKey) => {
        const { cardSettings, projects } = this.context;


        if (!cardSettings[cardKey]) {
            console.error("Card settings not found for key: ", cardKey);
            return <span>Loading...</span>;
        }

        const filteredProjects = this.getFilteredProjects(cardKey); 
    
        if (cardSettings[cardKey].displayOption === "graph") {
            return <ChartComponent tasks={filteredProjects} title={'Complete & Remaining Tasks'} tasksComplete={2} tasksRemaining={3} />;
        }
        else if (cardSettings[cardKey].displayOption === "calendar") {
            return <CalendarWidget projects={this.state.projects} />;
        }
    
        if (!projects || projects.length === 0) {
            return <span>Loading...</span>;
        }
    
        
        if (filteredProjects.length === 0) {
            return <span>No projects selected</span>;
        }
    
        return <DisplayProject projects={filteredProjects}
                               showProjectModal={this.state.showProjectModal} 
                               setShowProjectModal={this.props.setShowProjectModal} 
                               isEditing={this.state.locked} />;
    }
    

    render = () => {

    return (
        <div className={styles.dashboardLayoutStyle}>
        {
            this.state.locked &&
            <Button 
                className={`${styles.addCardButton}`}
                onClick={() => {
          
                let newX = Math.max(...this.context.layout.map(item => item.x + item.w));
                    let newY = Math.max(...this.context.layout.map(item => item.y + item.h));
                    this.addNewCard(newX, newY);
                    this.updateSnapPoints(newX, newY);
                    this.setState({ edited: true });
                }}
            >
                Add A New Card
            </Button>
        }
        <ResponsiveGridLayout
        className="layout"
        layouts={{lg: this.context.layout}}
        breakpoints={{ lg: 1200 }}
        cols={{ lg: 12 }}
        rowHeight={281}
        measureBeforeMount={false}
        style={{ height: "100%", overflow: "auto" }}
        margin={[30, 20, 30]}
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
        {this.context.layout.map( item => {
            const cardKey = item.i;
            return (
            <Card key={cardKey} variant="outlined" style={{overflowY: "auto"}}>
                {this.state.locked ?
                    <Row className="mx-auto" style={{ position: 'fixed', right: 0, top: 0, zIndex: 2 }}>
                        <Button
                            className={`${styles.editCardButton}`}
                            variant="outline-secondary"
                            onClick={() => this.deleteCard(cardKey)} // Pass the card key to the toggle method
                        >
                            <Trash size={20}/>
                        </Button> 
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
                    <Row className={`mx-auto ${styles.invisibleButton} `}>
                    <Button
                        className={`${styles.editCardButton} d-flex align-items-center justify-content-center`}
                        variant="outline-secondary"
                        onClick={() => this.toggleSettings(cardKey)}
                    >
                        <ThreeDots size={20} style={{ display: 'block', margin: 'auto' }}/>
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
                        return this.renderProjectOrChart(cardKey);
                    }} />
                )}
            </Card>
            )
        })}
        </ResponsiveGridLayout>
        <div className="d-flex align-items-center justify-content-center" 
        style = {{
                position: 'absolute',
                bottom: '10px',
                left: '0',
                right: '0',
                height: '50px',
                zIndex: '1'
            
         }}>
            { this.state.edited ?
                <div className={`animate pop d-flex align-items-center justify-content-center ${styles.saveContainer}`}
                     style={{position: 'fixed'}}
                > 
                    <div className="d-flex align-items-center justify-content-center"> 
                        <Button variant="outline-primary" 
                                className={`mx-auto ${styles.saveLayoutButton}`} 
                                onClick={() => { 
                                    this.context.saveCardSettingsAndLayout(this.context.cardSettings, this.context.layout,
                                                                           this.context.snapPoints) 
                                    this.props.updateParentLocked(false)
                                    this.setState({ oldLayout: this.context.layout, edited: false })
                                    }}>Save Layout</Button>
                        <Button variant="outline-secondary" 
                                className="mx-auto" onClick={() => {
                                    this.context.setCardSettings(this.state.previouSettings)
                                    this.context.setLayout(this.state.oldLayout)
                                    this.setState({ edited: false })
                                    this.props.updateParentLocked(false)
                                }}>Cancel Layout</Button>
                    </div>
                </div>
                : <></>
            }
        </div>

        
    </div>
    );
  }
}