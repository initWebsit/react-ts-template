import Pending from "../../../../../components/task/taskList/pending";
import styled from "@emotion/styled";
import Unclaimed from "../../../../../components/task/taskList/unclaimed";
const TaskListBox = styled.div`
  position: relative;
  background: #fff;
`;
const TaskList = () => {
    return (
        <TaskListBox>
            <Pending/>
            <Unclaimed/>
        </TaskListBox>
    )
}

export default TaskList;