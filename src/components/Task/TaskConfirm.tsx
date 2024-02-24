import "./TaskConfirm.css"
import CheckIcon from '@mui/icons-material/Check';
import { Close } from "@mui/icons-material";
import { usePiHome } from "../../providers/PihomeStateProvider";

const Task = () => {
    const pihome = usePiHome();

    const ackTask = (isConfirmed: boolean) => {
        pihome?.send_payload({
            webhook: {
                type: "acktask",
                confirm: isConfirmed
            }
        })
    }

    return (
        <div className="task-confirm-container">
            <div className="task-confirm-btn" style={{borderColor: 'green'}}
            onClick={() => ackTask(true)}
            >
                <CheckIcon />
            </div>
            <div className="task-confirm-btn" style={{borderColor: 'red'}}
                onClick={() => ackTask(false)}
            >
                <Close />
            </div>
        </div>
    )
}

export default Task;