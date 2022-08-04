export default function Login() {
  function handleSubmit(event: any) {
    console.log(event);
    event.preventDefault();
  }

  return (
    <div className="login">
      <div className="content">
        <div className="logo" />
        <form onSubmit={handleSubmit}>
          <div className="form-input">
            <input
              type="Username"
              placeholder="Username"
              name="username"
              required
            />
          </div>
          <div className="form-input">
            <a
              href="https://shatteredrealmsonline.com/forgot"
              target="_blank"
              rel="noreferrer"
            >
              Forgot password
            </a>
            <input
              type="password"
              placeholder="Password"
              name="password"
              required
            />
          </div>
          <div className="form-input">
            <button type="submit">Login</button>
          </div>
        </form>
        <a
          href="https://shatteredrealmsonline.com/register"
          target="_blank"
          rel="noreferrer"
          className="create-account"
        >
          Create a new account
        </a>
      </div>
    </div>
  );
}
