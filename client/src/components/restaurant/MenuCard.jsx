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
    <div className="menu-card-image-wrapper">
    <img
        src={
        item.image?.url
        ? item.image.url.replace(
            "/upload/",
            "/upload/f_auto,q_auto,w_400/"
          )
        : "/placeholder.jpg"
}
        alt={item.name}
        className="menu-card-img"
        width="400"
        height="220"
        loading="lazy"
    />
    </div>
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
                            <span className="unavailable-tag">
                                Unavailable
                            </span>
                        ) : getquantity(item._id) === 0 ? (
                            <button className="menu-card-add-btn" onClick={() =>addtocart(item)}>+ Add</button>
                        ) : (
                            <div className="menu-qty-control">
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
