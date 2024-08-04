# gantt-task-react

## Interactive Gantt Chart for React with TypeScript.

A highly customizable and interactive Gantt chart component for React with TypeScript support. This repository
integrates features and enhancements from the
original [`MaTeMaTuK/gantt-task-react`](https://github.com/MaTeMaTuK/gantt-task-react) ,
the [`ObeoNetwork/gantt-task-react`](https://github.com/ObeoNetwork/gantt-task-react) fork, and our current development,
creating a comprehensive solution for managing Gantt charts.

![multi-hierarchy.png](multi-hierarchy.png)

## Key Features

- **Performance Improvements**: Optimized rendering to handle large datasets efficiently, ensuring smooth user
  interactions.
- **Enhanced Customization**: Allows for more extensive task styling options to match brand-specific requirements.
- **TypeScript Integration**: Improved type definitions for safer and more efficient development workflows.
- **Responsive Design**: Improved mobile and tablet support for better usability across different devices.
- **Dependency Management**: Enhanced task dependency features, allowing for more complex project planning scenarios.
- **Advanced Timeline Navigation**: Features smooth navigation across different timeframes like months and weeks.
- **Localization Support**: Offers localization for various languages and date formats.
- **Event Handling**: Supports comprehensive event handling for interactive features.
- **QuarterYear View Mode**: Supports viewing tasks in quarterly segments, providing a flexible timeline view.

### Enhancement Summary

This repository combines the foundational work of `MaTeMaTuK/gantt-task-react` with enhancements from `ObeoNetwork`,
including better integration with TypeScript, improved rendering performance for large datasets, and new customization
options for task styling. The project is further developed in this fork, focusing on additional usability improvements
and feature expansions.

## Installation

Install the package using npm:

```bash
npm install @wamra/gantt-task-react
```

## How to use it

```javascript
import { Gantt, Task, EventOption, StylingOption, ViewMode, DisplayOption } from '@wamra/gantt-task-react';
import "@wamra/gantt-task-react/dist/index.css";

let tasks: Task[] = [
  {
    start: new Date(2020, 1, 1),
    end: new Date(2020, 1, 2),
    name: 'Idea',
    id: 'Task 0',
    type: 'task',
    progress: 45,
    isDisabled: true,
    styles: { progressColor: '#ffbb54', progressSelectedColor: '#ff9e0d' },
  },
  ...
];
<Gantt tasks={tasks}/>
```

You may handle actions

```javascript
<Gantt
  tasks={tasks}
  viewMode={view}
  onDateChange={onTaskChange}
  onTaskDelete={onTaskDelete}
  onProgressChange={onProgressChange}
  onDoubleClick={onDblClick}
  onClick={onClick}
/>
```

## How to run example

```
cd ./example
npm install
npm start
```

## Gantt Configuration

### GanttProps

| Parameter Name                  | Type          | Description                                        |
| :------------------------------ | :------------ | :------------------------------------------------- |
| tasks\*                         | [Task](#Task) | An array of tasks to display in the Gantt chart.   |
| viewMode                        | ViewMode      | Specifies the time scale for the chart.            |
| onDateChange                    | function      | Callback when a task's start or end date changes.  |
| onProgressChange                | function      | Callback when a task's progress changes.           |
| onDoubleClick                   | function      | Callback when a task is double-clicked.            |
| onClick                         | function      | Callback when a task is clicked.                   |
| rtl                             | boolean       | Right-to-left display mode.                        |
| locale                          | Locale        | Localization for date and time formatting.         |
| barBackgroundColor              | string        | Background color of task bars.                     |
| barProgressColor                | string        | Color of the task bar's progress indicator.        |
| projectBackgroundColor          | string        | Background color for project tasks.                |
| milestoneBackgroundColor        | string        | Background color for milestone tasks.              |
| todayColor                      | string        | Color of the "today" indicator line.               |
| arrowColor                      | string        | Color of dependency arrows.                        |
| fontFamily                      | string        | Font family for the chart.                         |
| fontSize                        | string        | Font size for text within the chart.               |
| rowHeight                       | number        | Height of each row.                                |
| columnWidth                     | number        | Width of each time unit column.                    |
| ganttHeight                     | number        | Total height of the Gantt chart.                   |
| ganttWidth                      | number        | Total width of the Gantt chart.                    |
| taskHeight                      | number        | Height of task bars within each row.               |
| dependencies                    | boolean       | Display task dependencies as arrows.               |
| taskListCellWidth               | string        | Width of the task list cell. Empty to hide.        |
| dragStep                        | number        | Time step for dragging actions, in milliseconds.   |

### EventOption

| Parameter Name     | Type                                                                          | Description                                                                             |
| :----------------- | :---------------------------------------------------------------------------- | :-------------------------------------------------------------------------------------- |
| onSelect           | (task: Task, isSelected: boolean) => void                                     | Function to execute on taskbar select/unselect event.                                   |
| onDoubleClick      | (task: Task) => void                                                          | Function to execute on taskbar double-click event.                                      |
| onClick            | (task: Task) => void                                                          | Function to execute on taskbar click event.                                             |
| onDelete\*         | (task: Task) => void/boolean/Promise<void>/Promise<boolean>                   | Function to execute on taskbar delete button press event.                               |
| onDateChange\*     | (task: Task, children: Task[]) => void/boolean/Promise<void>/Promise<boolean> | Function to execute when dragging taskbar event on timeline finishes.                   |
| onProgressChange\* | (task: Task, children: Task[]) => void/boolean/Promise<void>/Promise<boolean> | Function to execute when dragging taskbar progress event finishes.                      |
| onExpanderClick\*  | onExpanderClick: (task: Task) => void;                                        | Function to execute on the table expander click.                                        |
| onWheel\*          | onWheel: (wheelEvent: WheelEvent) => void;                                    | Function to execute when the mouse wheel is used.                                       |
| timeStep           | number                                                                        | Time step value for onDateChange. Specify in milliseconds.                              |

> > Chart undoes operation if method returns false or error. Parameter children returns one-level deep records.

### DisplayOption

| Parameter Name      | Type    | Description                                                                                                                             |
| :------------------ | :------ | :---------------------------------------------------------------------------------------------------------------------------------------|
| viewMode            | enum    | Specifies the time scale. Options: Hour, Quarter Day, Half Day, Day, Week(ISO-8601, 1st day is Monday), Month, QuarterYear, Year.       |
| viewDate            | date    | Specifies display date and time for display.                                                                                            |
| preStepsCount       | number  | Specifies empty space before the first task.                                                                                            |
| locale              | string  | Specifies the month name language. Able formats: ISO 639-2, Java Locale.                                                                |
| monthCalendarFormat | string  | Specifies the month display on the calendar.                                                                                            |
| monthTaskListFormat | string  | Specifies the month display on the list.                                                                                                |
| rtl                 | boolean | Sets rtl mode.                                                                                                                          |
| roundDate           |         | Allows customizing the way the date start/end are rounded.                                                                              |
| checkIsHoliday      |         | Tells if a date is a holiday. Impacts the style of the day and the way the date is adjusted to working days.                            |
| dateMoveStep        |         | An object corresponding to a duration. Gives the step to adjust to the working day when moving the date allowing smooth feedback.       |

### StylingOption

| Parameter Name             | Type   | Description                                                                                              |
|----------------------------|--------|----------------------------------------------------------------------------------------------------------|
| headerHeight               | number | Specifies the header height.                                                                             |
| columnWidth                | number | Specifies the time period width.                                                                         |
| listCellWidth              | string | Specifies the task list cell width. Empty string means "no display".                                      |
| rowHeight                  | number | Specifies the task row height.                                                                            |
| barCornerRadius            | number | Specifies the taskbar corner rounding.                                                                    |
| barFill                    | number | Specifies the taskbar occupation, in percent from 0 to 100.                                               |
| handleWidth                | number | Specifies the width of the taskbar drag control for start and end dates.                                  |
| fontFamily                 | string | Specifies the font family for the application.                                                           |
| fontSize                   | string | Specifies the font size for the application.                                                             |
| barProgressColor           | string | Specifies the taskbar progress fill color globally.                                                      |
| barProgressSelectedColor   | string | Specifies the taskbar progress fill color globally when selected.                                         |
| barBackgroundColor         | string | Specifies the taskbar background fill color globally.                                                    |
| barBackgroundSelectedColor | string | Specifies the taskbar background fill color globally when selected.                                       |
| arrowColor                 | string | Specifies the relationship arrow fill color.                                                             |
| arrowIndent                | number | Specifies the relationship arrow right indent, in px.                                                    |
| todayColor                 | string | Specifies the current period column fill color.                                                          |
| TooltipContent             | `React.FC<{ task: Task; fontSize: string; fontFamily: string; }>;`       | Specifies the Tooltip view for selected taskbar.                                               |
| TaskListHeader             | `React.FC<{ headerHeight: number; rowWidth: string; fontFamily: string; fontSize: string;}>;`       | Specifies the task list Header view                                                            |
| TaskListTable              | `React.FC<{ rowHeight: number; rowWidth: string; fontFamily: string; fontSize: string; locale: string; tasks: Task[]; selectedTaskId: string; setSelectedTask: (taskId: string) => void; }>;`       | Specifies the task list Table view                                                             |

### Task

| Parameter Name | Type     | Description                                                                                           |
| :------------- | :------- | :---------------------------------------------------------------------------------------------------- |
| id\*           | string   | Task id.                                                                                              |
| name\*         | string   | Task display name.                                                                                    |
| type\*         | string   | Task display type: **task**, **milestone**, **project**                                               |
| start\*        | Date     | Task start date.                                                                                      |
| end\*          | Date     | Task end date.                                                                                        |
| progress\*     | number   | Task progress. Sets in percent from 0 to 100.                                                         |
| assignees\*    | string[] | List of people assigned to the task                                                                   |
| dependencies   | string[] | Specifies the parent dependencies ids.                                                                |
| styles         | object   | Specifies the taskbar styling settings locally. Object is passed with the following attributes:       |
|                |          | - **backgroundColor**: String. Specifies the taskbar background fill color locally.                   |
|                |          | - **backgroundSelectedColor**: String. Specifies the taskbar background fill color locally on select. |
|                |          | - **progressColor**: String. Specifies the taskbar progress fill color locally.                       |
|                |          | - **progressSelectedColor**: String. Specifies the taskbar progress fill color globally on select.    |
| isDisabled     | bool     | Disables all action for current task.                                                                 |
| fontSize       | string   | Specifies the taskbar font size locally.                                                              |
| project        | string   | Task project name                                                                                     |
| hideChildren   | bool     | Hide children items. Parameter works with project type only                                           |

> > *Required

## License

[MIT](https://oss.ninja/mit/jaredpalmer/)
