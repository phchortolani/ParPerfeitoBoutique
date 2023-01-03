export default function DefaultCard(props) {
    return (<div className={props.class}>
        <div className="card shadow mt-3 ">
            <div className="card-header py-3">
                <h6 className="m-0 font-weight-bold text-primary">
                    {props.icoTitle ? <i className={"pr-2 " + props.icoTitle}></i> : ""}
                    {props.title}</h6>
            </div>
            <div  className={"card-body " + props.cardBodyClass}>
                {props.children}
            </div>
        </div>
    </div>
    )
}