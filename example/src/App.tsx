import { Task, ViewMode, Gantt } from "@ObeoNetwork/gantt-task-react";
import { ViewSwitcher } from "./components/view-switcher";
import { getStartEndDateForProject, initTasks } from "./helper";
import { TaskListColumnEnum } from "@ObeoNetwork/gantt-task-react";
import { TaskContextualPaletteProps } from "@ObeoNetwork/gantt-task-react";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import "./App.module.css";
import React from "react";
import "./index.css";
import "@ObeoNetwork/gantt-task-react/dist/style.css";

// Init
const App = () => {
  const [viewMode, setView] = React.useState<ViewMode>(ViewMode.Day);
  const [tasks, setTasks] = React.useState<Task[]>(initTasks());
  const [isChecked, setIsChecked] = React.useState(true);
  let columnWidth = 65;
  if (viewMode === ViewMode.Year) {
    columnWidth = 350;
  } else if (viewMode === ViewMode.Month) {
    columnWidth = 300;
  } else if (viewMode === ViewMode.Week) {
    columnWidth = 250;
  }

  const handleTaskChange = (task: Task) => {
    console.log("On date change Id:" + task.id);
    let newTasks = tasks.map(t => (t.id === task.id ? task : t));
    if (task.project) {
      const [start, end] = getStartEndDateForProject(newTasks, task.project);
      const project = newTasks[newTasks.findIndex(t => t.id === task.project)];
      if (
        project.start.getTime() !== start.getTime() ||
        project.end.getTime() !== end.getTime()
      ) {
        const changedProject = { ...project, start, end };
        newTasks = newTasks.map(t =>
          t.id === task.project ? changedProject : t
        );
      }
    }
    setTasks(newTasks);
  };

  const handleTaskDelete = (task: Task) => {
    const conf = window.confirm("Are you sure about " + task.name + " ?");
    if (conf) {
      setTasks(tasks.filter(t => t.id !== task.id));
    }
    return conf;
  };

  const handleProgressChange = async (task: Task) => {
    setTasks(tasks.map(t => (t.id === task.id ? task : t)));
    console.log("On progress change Id:" + task.id);
  };

  const handleDblClick = (task: Task) => {
    alert("On Double Click event Id:" + task.id);
  };

  const handleClick = (task: Task) => {
    console.log("On Click event Id:" + task.id);
  };

  const handleSelect = (task: Task, isSelected: boolean) => {
    console.log(task.name + " has " + (isSelected ? "selected" : "unselected"));
  };

  const handleExpanderClick = (task: Task) => {
    setTasks(tasks.map(t => (t.id === task.id ? task : t)));
    console.log("On expander click Id:" + task.id);
  };

  const handleWheel = (wheelEvent: WheelEvent) => {
    const deltaY = wheelEvent.deltaY;

    if (deltaY < 0 && viewMode !== ViewMode.Hour) {
      const currentIndex = Object.values(ViewMode).indexOf(viewMode);
      const newZoomLevel = Object.values(ViewMode).at(currentIndex - 1);
      if (newZoomLevel) {
        setView(newZoomLevel);
      }
    } else if (deltaY > 0 && viewMode !== ViewMode.Month) {
      const currentIndex = Object.values(ViewMode).indexOf(viewMode);
      const newZoomLevel = Object.values(ViewMode).at(currentIndex + 1);
      if (newZoomLevel) {
        setView(newZoomLevel);
      }
    }
  };
  const columns: any[] = [
    { columntype: TaskListColumnEnum.NAME, columnWidth: "155px" },
    { columntype: TaskListColumnEnum.ASSIGNEE, columnWidth: "80px" },
  ];

  const ContextualPalette: React.FC<TaskContextualPaletteProps> = ({
    selectedTask,
    onClose,
  }) => {
    return (
      <div className="buttonEntries">
        <IconButton
          size="small"
          aria-label="Delete task"
          title="Delete task"
          onClick={() => handleTaskDelete(selectedTask)}
          data-testid="delete-task"
        >
          <DeleteForeverIcon fontSize="small" />
        </IconButton>
        <IconButton
          size="small"
          aria-label="Close toolbar"
          title="Close toolbar"
          onClick={onClose}
          data-testid="close-toolbar"
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </div>
    );
  };

  return (
    <div className="Wrapper">
      <ViewSwitcher
        onViewModeChange={viewMode => setView(viewMode)}
        onViewListChange={setIsChecked}
        isChecked={isChecked}
      />
      <h3>Gantt With Unlimited Height</h3>
      <Gantt
        tasks={tasks}
        viewMode={viewMode}
        onDateChange={handleTaskChange}
        onDelete={handleTaskDelete}
        onProgressChange={handleProgressChange}
        onDoubleClick={handleDblClick}
        onClick={handleClick}
        onSelect={handleSelect}
        onExpanderClick={handleExpanderClick}
        displayTaskList={isChecked}
        columnWidth={columnWidth}
      />
      <h3>
        Gantt With Limited Height, custom columns, custom Mouse behavior,
        draggable grid
      </h3>
      <Gantt
        tasks={tasks}
        enableGridDrag={true}
        columns={columns}
        displayTaskList={isChecked}
        viewMode={viewMode}
        onDateChange={handleTaskChange}
        onDelete={handleTaskDelete}
        onProgressChange={handleProgressChange}
        onDoubleClick={handleDblClick}
        onClick={handleClick}
        onSelect={handleSelect}
        onExpanderClick={handleExpanderClick}
        ganttHeight={300}
        columnWidth={columnWidth}
        onWheel={handleWheel}
        ContextualPalette={ContextualPalette}
      />
    </div>
  );
};

export default App;
