import "../../css/restaurant/MenuCard.css";


export default function MenuCard({
    item,
    isOwner,
    addtocart,
    removefromcart,
    getquantity,
    handleDeleteMenu
}) {

return (
    <div className="menu-card">

    <img
        src={item.image?.url}
        alt={item.name}
        className="menu-card-img"
    />

    <div className="menu-card-body">

    <h3>{item.name}</h3>

    <span>₹{item.price}</span>

        {item.description && (
            <p>{item.description}</p>
        )}

    {/* Owner View */}
    {isOwner ? (
    <div className="owner-menu-actions">
        <button onClick={() => handleDeleteMenu(item._id)}>Delete</button>
    </div>) : (
            <>
            {/* Customer View */}
                {!item.isAvailable ? (
                            <span>
                                Unavailable
                            </span>
                        ) : getquantity(item._id) === 0 ? (
                            <button onClick={() =>addtocart(item)}>+ Add</button>
                        ) : (
                            <div>
                                <button onClick={() =>removefromcart(item._id)}>-</button>
                                <span>
                                    {getquantity(item._id)}
                                </span>
                                <button
                                    onClick={() =>
                                        addtocart(item)
                                    }
                                >
                                    +
                                </button>
                            </div>
                        )}
                    </>
                )}

            </div>
        </div>
    );
}
