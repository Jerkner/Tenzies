export default function Die(props) {
    let isHeld

    if (props.isHeld === false) {
        isHeld = "dice"
    } else {
        isHeld = "dice-held"
    }

    return (
        <img className={isHeld}
            onClick={props.handleClick}
            src={`images/${props.value}.png`} />
    )
}
