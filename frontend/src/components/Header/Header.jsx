import "./Header.css";

function Header({
  title = "Home",
  user = "Anil Kumar",
  onMenuClick,
}) {
  return (
    <header className="header">

      <div className="header-left">

        {/* Mobile hamburger */}
        <button
          className="menu-toggle"
          onClick={onMenuClick}
          aria-label="Open sidebar"
          type="button"
        >
          ☰
        </button>

        <h2>{title}</h2>

      </div>

      <div className="header-right">

        <div className="user-info">
          <span>{user}</span>
        </div>

      </div>

    </header>
  );
}

export default Header;