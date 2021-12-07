export default function Loading(props) {
    let size = props.size ?? "17px";
    return <span style={{ height: size, width: size }} className="spinner-border"></span>
}