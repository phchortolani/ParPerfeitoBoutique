export default function Modal(props) {

    return (
        <div className={"modal fade " + (props.open ? "show d-block" : "")} tabIndex="-1" style={{ backdropFilter: "brightness(0.5)", }} role="dialog" aria-labelledby={props.title} aria-hidden="false">
            <div  className="modal-dialog modal-dialog-centered animated--grow-in" role="document">
                <div className="modal-content shadow-sm border-0 border-bottom-primary">
                    <div className="modal-header">
                        <h5 className="modal-title text-primary" id="TituloModalCentralizado">{props.title}</h5>
                        <button type="button" onClick={() => props.closeModal()} className="close" data-dismiss="modal" aria-label="Fechar">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body ">
                        {props.children}
                    </div>
                </div>
            </div>
        </div>
    )
}