import "./Header.css";

function Header({ title = "Home", user = "Anil Kumar" }) {
  return (
    <header className="header">

      <div className="header-left">
        <h2>{title}</h2>
      </div>

      <div className="header-right">

        {/* <div className="notification">
          🔔
        </div> */}

        <div className="user-info">
          <span>{user}</span>
        </div>

      </div>

    </header>
  );
}

export default Header;