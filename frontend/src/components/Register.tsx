import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  const [registerName, setRegisterName] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [newUser, setNewUser] = useState('');

  const registerFunction = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(registerName);
    console.log(registerPassword);

    if (registerName !== '' && registerPassword !== '') {
      try {
        const response = await fetch('http://localhost:5000/api/shopping/username', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ user: registerName, pass: registerPassword }),
        })

        const newUserResponse = await response.json()
        setNewUser(newUserResponse)
        console.log(newUser)

        if (response.ok) {
          alert('Registered Successfully')
          navigate('/')
        } else {
          alert('Username already exists')
        }
      } catch (error) {
        console.error('Error registering user:', error);
      }
    }
  };

  return (
    <div className="login-block">
        <div className="login-div">
        <h1 className="login-title">Register:</h1>
      <form onSubmit={(e) => registerFunction(e)}>
        <div>
          <label>Enter a username:</label><br></br>
          <input className="input-bar" value={registerName} onChange={(e) => setRegisterName(e.target.value)} />
        </div>
        <div>
          <label>Enter a password:</label><br></br>
          <input className="input-bar" value={registerPassword} onChange={(e) => setRegisterPassword(e.target.value)} />
        </div>
        <button className="submit-btn" type="submit">Register</button>
      </form>
      <p className="link">
        <Link to="/">Cancel</Link>
      </p>
      </div>
    </div>
  );
};

export default Register;

