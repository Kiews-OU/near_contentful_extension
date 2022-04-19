import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import { Button, TextInput } from '@contentful/forma-36-react-components';
import { init, locations } from 'contentful-ui-extensions-sdk';
import tokens from '@contentful/forma-36-tokens';
import '@contentful/forma-36-react-components/dist/styles.css';
import './index.css';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { store } from './store';
import getConfig from './config';
const nearAPI = require("near-api-js");
require('dotenv').config()

export const DialogExtension = ({ sdk }) => {
  const propTypes = {
    sdk: PropTypes.object.isRequired
  }


  let dispatch = useDispatch()
  let walletData = useSelector((state) => state.wallet)


  const { connect, utils } = nearAPI
  const { keyStores, KeyPair } = nearAPI;
  const keyStore = new keyStores.InMemoryKeyStore();
  const PRIVATE_KEY = "ed25519:2iut8x9wQxLEtfnfA8XAAnHH6FaJJQZ6QDZuzmUQWUMbLE7nt8E2Ro5aHZPjaYU8GZmidsfWMtgR4yKhJNqJNRqy"
  const keyPair = KeyPair.fromString(PRIVATE_KEY);
  const sender = `${walletData.walletID}`
  const receiver = `${walletData.rid}`;
  const networkId = 'testnet';
  const amount = utils.format.parseNearAmount(`${walletData.sum}`);
  const am=utils.format.parseNearAmount(`${walletData.walletSum}`);


  const config = {
    networkId: "testnet",
    keyStore,
    nodeUrl: "https://rpc.testnet.near.org",
    walletUrl: "https://myfirstwallet.testnet.near.org",
    helperUrl: "https://myfirstwallet.testnet.near.org",
    explorerUrl: "https://myfirstwallet.testnet.near.org",
  };

  const [balance, setBalance] = useState("")
  const [active, setActive] = useState(Boolean)


  
  const SendTransaction = async () => {
    keyStore,
      keyPair,
      await keyStore.setKey(networkId, sender, keyPair);
    const near = await connect(config);
    const senderAccount = await near.account(sender);
    try {
      console.log(`Sending ${utils.format.formatNearAmount(amount)}Ⓝ from ${sender} to ${receiver}...`);
      const result = await senderAccount.sendMoney(receiver, amount);
      // console results
      console.log('Transaction Results: ', result.transaction);
      console.log('--------------------------------------------------------------------------------------------');
      console.log('OPEN LINK BELOW to see transaction in NEAR Explorer!');
      console.log(`${config.explorerUrl}/transactions/${result.transaction.hash}`);
      console.log('--------------------------------------------------------------------------------------------');
    } catch (error) {
      // return an error if unsuccessful
      console.log(error);
    }
  }




  window.nearConfig = getConfig(process.env.NODE_ENV || "development");
  async function initContract() {
 
    // Initializing connection to the NEAR node.
    window.near = await nearAPI.connect(Object.assign({ deps: { keyStore: new nearAPI.keyStores.BrowserLocalStorageKeyStore() } }, nearConfig));
    console.log(window.near);
   
    // Initializing Wallet based Account. It can work with NEAR TestNet wallet that
    // is hosted at https://wallet.testnet.near.org
    window.walletAccount = new nearAPI.WalletAccount(window.near);
    console.log(window.walletAccount);
    // Getting the Account ID. If unauthorized yet, it's just empty string.
    window.accountId = window.walletAccount.getAccountId();
    console.log(window.accountId);
  
    // Initializing our contract APIs by contract name and configuration.
    window.contract = await window.near.loadContract(nearConfig.contractName, {
      // NOTE: This configuration only needed while NEAR is still in development
      // View methods are read only. They don't modify the state, but usually return some value.
      viewMethods: ['whoSaidHi'],
      // Change methods can modify the state. But you don't receive the returned value when called.
      changeMethods: ['sayHi'],
      // Sender is the account ID to initialize transactions.
      sender: window.accountId,
    });
    console.log(window.contract);
  }




  const GetBalance = async () => {
    await keyStore.setKey("testnet", "myfirstwallet.testnet", keyPair);
    const near = await connect(config);
    const account = await near.account("myfirstwallet.testnet");
    const sum = await account.getAccountBalance();
    // console.log(sum);
    setBalance(sum.available)
  }


  useEffect(() => {
    setActive(false)
    GetBalance()
  }, [])



  return (
    <>
      <div style={{ margin: tokens.spacingM, display: "flex", flexDirection: "column", height: "auto" }}>
        <Button onClick={()=>{
          initContract()
        }} >
        init Contract
        </Button>
        <Button
          testId="close-dialog"
          buttonType="positive"
          onClick={() => {
            console.log(utils.format.parseNearAmount(balance));
            // console.log(balance);
            sdk.notifier.success(`Your Wallet connected successfully: Your balance ${balance} Ⓝ  `)
          }}>
          Show My Balance
        </Button>
        <Button
          onClick={() => {
            setActive(true)
            dispatch({ type: "setdata", available: balance, id: "myfirstwallet.testnet" })
          }}
        >
          Send Near
        </Button>
        <div style={active ? { display: "flex", flexDirection: "column", marginBottom: "5px" } : { display: "none" }}>
          <div style={{ display: "flex" }} >
            <TextInput placeholder='Sum of Near'
              value={walletData.sum}
              onChange={(e) => {
                dispatch({ type: "enterval", data: e.target.value, key: "sum" })
              }}
            />
            <TextInput
              value={walletData.rid}
              onChange={(e) => {
                dispatch({ type: "enterval", data: e.target.value, key: "rid" })
              }}
              placeholder='Reciever ID' />
          </div>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Button
              onClick={() => {
                SendTransaction()
                console.log(keyStore.keys);
              }}
            >Send</Button>
            <Button buttonType="negative"
              onClick={() => {
                setActive(false)
              }}
            >Cancel</Button>
          </div>
        </div>
        <Button
          testId="close-dialog"
          buttonType="negative"
          onClick={() => {
            sdk.close('data from modal dialog');
          }}>
          Close modal
        </Button>
      </div>

    </>
  )
}


export const SidebarExtension = ({ sdk }) => {
  const propTypes = {
    sdk: PropTypes.object.isRequired
  };
  useEffect(() => {
    sdk.window.startAutoResizer();
  }, [])

  const onButtonClick = async () => {
    const result = await sdk.dialogs.openExtension({
      width: 800,
      title: 'The same extension rendered in modal window'
    });
    console.log(result);
  };

  return (
    <Button
      buttonType="positive"
      isFullWidth={true}
      testId="open-dialog"
      onClick={onButtonClick}>
      Click on me to open dialog extension
    </Button>
  );
}



export const initialize = sdk => {
  if (sdk.location.is(locations.LOCATION_DIALOG)) {
    ReactDOM.render(<Provider store={store} >
      <DialogExtension sdk={sdk} />
    </Provider>, document.getElementById('root'));
  } else {
    ReactDOM.render(<SidebarExtension sdk={sdk} />, document.getElementById('root'));
  }
};

init(initialize);

/**
 * By default, iframe of the extension is fully reloaded on every save of a source file.
 * If you want to use HMR (hot module reload) instead of full reload, uncomment the following lines
 */
// if (module.hot) {
//   module.hot.accept();
// }
