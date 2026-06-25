import MenuCard from "./MenuCard";

export default function MenuList({
  id,
  grouped,
  addtocart,
  removefromcart,
  getquantity,isOwner,handleDeleteMenu
}) {
  return (
    <>
      {Object.entries(grouped).map(
        ([category, items]) => (
          <div
            key={category}
            className="menu-section"
          >
            <h2 className="menu-category-title">
              {category}
            </h2>

            <div className="menu-grid">
              {items.map((item) => (
               <MenuCard
                  key={item._id}
                  item={item}
                  isOwner={isOwner}
                  addtocart={addtocart}
                  removefromcart={removefromcart}
                  getquantity={getquantity}
                  handleDeleteMenu={handleDeleteMenu}
                 />
              ))}
            </div>
          </div>
        )
      )}
    </>
  );
}
