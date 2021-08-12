import * as React from "react";
import "./App.css";
import lottery from "./lottery";
import web3 from "./web3";

function App() {
  const [manager, setManager] = React.useState("");
  const [players, setPlayers] = React.useState([]);
  const [balance, setBalance] = React.useState("");
  const [value, setValue] = React.useState("");
  const [message, setMessage] = React.useState("");

  React.useEffect(() => {
    async function loadContract() {
      const contractManager = await lottery.methods.manager().call();
      setManager(contractManager);
      const contractPlayers = await lottery.methods.getPlayers().call();
      setPlayers(contractPlayers);
      const contractBalance = await web3.eth.getBalance(
        lottery.options.address
      );
      setBalance(contractBalance);
    }

    loadContract();
  }, []);

  async function onSubmit(event) {
    event.preventDefault();

    if (!value) {
      return;
    }

    const accounts = await web3.eth.getAccounts();

    setMessage("Waiting on transaction success...");

    try {
      await lottery.methods.enter().send({
        from: accounts[0],
        value: web3.utils.toWei(value, "ether"),
      });

      setMessage("Successfully entered the lottery");
    } catch (err) {
      setMessage("Error entering the lottery");
      console.error("Error entering the lottery", err);
    }
  }

  async function onClick(event) {
    event.preventDefault();
    const accounts = await web3.eth.getAccounts();

    setMessage("Waiting on transaction success...");
    try {
      await lottery.methods.pickWinner().send({
        from: accounts[0],
      });

      setMessage("A winner has been picked!");
    } catch (err) {
      setMessage("Error picking the winner");
      console.error("Error picking the winner", err);
    }
  }

  return (
    <div>
      <h2>Lottery Contract</h2>
      <p>{`This contract is managed by ${manager}.`}</p>
      <p>{`There are currently ${
        players.length
      } people entered, competing to win ${web3.utils.fromWei(
        balance,
        "ether"
      )} ether!
      `}</p>
      <hr />
      <form onSubmit={onSubmit}>
        <h4>Want to try your luck?</h4>
        <div>
          <label>Amount of ether to enter</label>
          <input
            onChange={(event) => setValue(event.target.value)}
            value={value}
          />
          <button>Enter</button>
        </div>
      </form>
      <hr />

      <h4>Ready to pick a winner?</h4>
      <button onClick={onClick}>Pick a Winner!</button>
      <hr />
      {message ? <h3>{message}</h3> : null}
    </div>
  );
}

export default App;
