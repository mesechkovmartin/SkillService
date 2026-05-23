import NavBarPrivate from "../../components/NavBar/NavBarPrivate"
import AddPostForm from "../../components/AddPostForm/AddPostForm"

export default function MyServices() {
    return (
        <>
            <NavBarPrivate />

            <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">My Services</h1>

                    <button className="btn btn-primary"
                        onClick={() => document.getElementById("add-post-modal").showModal()

                        }
                    >
                        Add Service
                    </button>
                </div>

                <dialog id="add-post-modal" className="modal">
                    <div className="modal-box">
                        <h3 className="font-bold text-lg mb-4">Add Service</h3>

                        <AddPostForm />

                        <div className="modal-action">
                            <form method="dialog">
                                <button className="btn">Close</button>
                            </form>
                        </div>
                    </div>
                </dialog>
            </div>
        </>
    )
}