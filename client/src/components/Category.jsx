import "./Category.css";

const categories = [
  { name: "All", icon: "🍽️" },
  { name: "Pizza", icon: "🍕" },
  { name: "Burgers", icon: "🍔" },
  { name: "Noodles", icon: "🍜" },
  { name: "Chicken", icon: "🍗" },
  { name: "Desserts", icon: "🍰" },
  { name: "Healthy", icon: "🥗" },
  { name: "Drinks", icon: "🥤" },
];

export default function Category({handlesearch}) {
  return (
    <div className="categoryContainer">
      {categories.map((item) => (
        <div className="categoryCard" key={item.name} onClick={()=>handlesearch(item.name)}>
          <div className="categoryIcon">
            {item.icon}
          </div>

          <p className="categoryname">{item.name}</p>
        </div>
      ))}
    </div>
  );
}
