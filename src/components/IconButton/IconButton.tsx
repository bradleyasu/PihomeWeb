import "./IconButton.css";

interface Props {
    icon: any;
    onClick?: () => void;
}

const IconButton = ({icon, onClick} : Props) => {

    return (
        <div onClick={onClick} className={"icon-button"}>
            {icon}
        </div>
    )

}

export default IconButton;