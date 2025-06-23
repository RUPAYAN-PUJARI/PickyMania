import logo from "/assets/logo.png";

export default function Header() {
  return (
    <>
      <header className="Head">
        <img src={logo} alt="App Logo" className="logo" />
        <div className="header-text">
          <h1>PickyMania</h1>
          <h2>Your favourite shopping place</h2>
        </div>
      </header>
    </>
  );
}
