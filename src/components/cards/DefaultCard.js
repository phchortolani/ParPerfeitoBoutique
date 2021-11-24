export default function DefaultCard(props) {
    return (<>
        <div className="card shadow mt-3">
            <div className="card-header py-3">
                <h6 className="m-0 font-weight-bold text-primary">{props.title}</h6>
            </div>
            <div className="card-body">
                {props.children}
            </div>
        </div>
    </>
    )
}