import React, { useEffect, useState } from 'react';
import { render } from 'react-dom';
import PropTypes from 'prop-types';
import { init, locations } from 'contentful-ui-extensions-sdk';
import { TabPanel, Button, TextInput } from '@contentful/forma-36-react-components';
import '@contentful/forma-36-react-components/dist/styles.css';
import '@contentful/forma-36-fcss/dist/styles.css';
import './index.css';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { store } from './store';
import { WalletConnection } from 'near-api-js';
import { parseContract } from 'near-contract-parser';
const nearAPI = require("near-api-js");
const { connect, utils } = nearAPI
const { keyStores, KeyPair } = nearAPI;
const keyStore = new keyStores.BrowserLocalStorageKeyStore();
const networkId = 'testnet';




const config = {
  networkId,
  keyStore,
  nodeUrl: `https://rpc.${networkId}.near.org`,
  walletUrl: `https://wallet.${networkId}.near.org`,
  helperUrl: `https://helper.${networkId}.near.org`,
  explorerUrl: `https://explorer.${networkId}.near.org`,
};



export const MainPage = ({ sdk }) => {
  const [active, setActive] = useState(Boolean)
  const [balance, setBalance] = useState("")
  let dispatch = useDispatch()
  let walletData = useSelector((state) => state.wallet)
  console.log(walletData);
  const sender = `${walletData.walletID}`
  const receiver = `${walletData.rid}`;
  const amount = utils.format.parseNearAmount(`${walletData.sum}`);

  const [active1, setActive1] = useState(false)
  const [keyPair, setKeyPair] = useState("")
  function Connect() {
    const PRIVATE_KEY = walletData.key
    const keyPair = KeyPair.fromString(PRIVATE_KEY);
    setKeyPair(keyPair)
    setActive(false)
    GetBalance()
    GetCurrency()
    setActive1(true)
  }

  const GetBalance = async () => {
    await keyStore.setKey(networkId, walletData.id, keyPair);
    const near = await connect(config);
    const account = await near.account(walletData.id);
    console.log(account);
    const sum = await account.getAccountBalance();
    console.log(sum);
    const amountInNEAR = utils.format.formatNearAmount(sum.available, 2);
    setBalance(amountInNEAR)
  }




  const BalanceInUSd = balance * walletData.price
  const usdSum = walletData.sum * walletData.price

  function GetCurrency() {
    dispatch({ type: "price" })
  }




  const [method, setMethod] = useState({})
  async function ParseContract() {
    let near = await nearAPI.connect(config)

    const { code_base64 } = await near.connection.provider.query({
      account_id: walletData.CID,
      finality: 'final',
      request_type: 'view_code',
    });

    const parsed_contract = await parseContract(code_base64)

    console.log('---- parsed contract ', parsed_contract)
    console.log('Contract Methods: ', parsed_contract.byMethod)
    setMethod(parsed_contract.byMethod)
  }




  return (
    <>
      <TabPanel style={active1 ? { display: "none" } : { display: "block" }} >
        <div style={{ width: "100%vh", height: "auto", display: "flex", justifyContent: "center" }} >
          <div style={{ border: "1px solid gray", width: "700px", height: "auto", borderRadius: "16px", marginTop: "50px" }} >
            <div style={{ margin: "30px", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }} >
              <TextInput placeholder='Account Id'
                style={{ borderRadius: "16px", marginBottom: "12px" }}
                onChange={(e) => {
                  dispatch({ type: "setAccData", value: e.target.value, key: "id" })
                }}
              />
              <TextInput placeholder='Private KEY'
                style={{ borderRadius: "16px" }}
                onChange={(e) => {
                  dispatch({ type: "setAccData", value: e.target.value, key: "key" })
                }}
              />
              <Button buttonType='success' style={{ marginTop: "12px" }}
                onClick={() => {
                  Connect()
                }}
              >
                Connect
              </Button>
            </div>
          </div>
        </div>
      </TabPanel>
      <TabPanel style={active1 ? { display: "block" } : { display: "none" }} id="main" className="f36-margin-top--l">
        <div style={{ width: "100%vh", height: "auto", display: "flex", justifyContent: "center" }} >
          <div style={active ? { display: "none" } : { border: "1px solid gray", width: "700px", height: "auto", borderRadius: "16px" }} >
            <div className="header" >
              <img style={{ width: "35px", height: "20px", paddingRight: "20px" }}
                src={require('./assets/near-logo.png')} />
              <h1> My Wallet </h1>
            </div>
            <div className="blockBalance" >

              <h1 style={{ fontWeight: "900", fontSize: "65px", margin: "0px" }} >${BalanceInUSd.toLocaleString(undefined, { maximumFractionDigits: 2 })} </h1>
              <p style={{ color: "gray" }} >Available Balance</p>
            </div>
            <div className="blockButtons" >
              <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }} >
                <div
                  onClick={() => {
                    setActive(true)
                    dispatch({ type: "setdata", available: balance, id: process.env.ACCOUNT_ID })
                  }}

                  className="buttons" >
                  <svg style={{ color: "white" }} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-send" viewBox="0 0 16 16">
                    <path d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576 6.636 10.07Zm6.787-8.201L1.591 6.602l4.339 2.76 7.494-7.493Z" />
                  </svg>
                </div>
                <p style={{ margin: "0px" }} >Send</p>
              </div>

              <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}
                oncloc
              >
                <div
                  className="buttons" >
                  <svg style={{ color: "white" }} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-90deg-down" viewBox="0 0 16 16">
                    <path fill-rule="evenodd" d="M4.854 14.854a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 .708-.708L4 13.293V3.5A2.5 2.5 0 0 1 6.5 1h8a.5.5 0 0 1 0 1h-8A1.5 1.5 0 0 0 5 3.5v9.793l3.146-3.147a.5.5 0 0 1 .708.708l-4 4z" />
                  </svg>
                </div>
                <p style={{ margin: "0px" }} >Recieve</p>
              </div>

              <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }} >

                <div
                  className="buttons" >
                  <svg style={{ color: "white" }} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-plus-circle" viewBox="0 0 16 16">
                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                    <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
                  </svg>
                </div>
                <p style={{ margin: "0px" }} >Top Up</p>
              </div>

            </div>
            <div className="blockBottom" >
              <p style={{ color: "gray" }} >Your Portfolio</p>
            </div>
            <div className="blockNear" >
              <div class="icon">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="16" cy="16" r="16" fill="#111618">
                </circle>
                  <g clip-path="url(#clip0000000003)">
                    <path d="M20.8422 8.84471L17.4978 13.776C17.4501 13.847 17.43 13.9328 17.4411 14.0174C17.4522 14.102 17.4938 14.1798 17.5582 14.2363C17.6225 14.2928 17.7053 14.3243 17.7913 14.3249C17.8772 14.3254 17.9604 14.2951 18.0256 14.2395L21.3178 11.4036C21.3371 11.3865 21.361 11.3753 21.3866 11.3714C21.4122 11.3675 21.4383 11.3711 21.4619 11.3818C21.4855 11.3924 21.5054 11.4096 21.5193 11.4314C21.5331 11.4531 21.5403 11.4783 21.54 11.504V20.3824C21.54 20.4095 21.5316 20.4361 21.5158 20.4583C21.5001 20.4806 21.4779 20.4975 21.4522 20.5068C21.4265 20.516 21.3985 20.5172 21.3721 20.5102C21.3456 20.5031 21.322 20.4882 21.3044 20.4673L11.3533 8.63726C11.1933 8.44956 10.994 8.29873 10.7693 8.19525C10.5446 8.09178 10.2999 8.03815 10.0522 8.03809H9.70444C9.2524 8.03809 8.81887 8.21642 8.49922 8.53386C8.17957 8.8513 8 9.28185 8 9.73078V22.2351C8 22.684 8.17957 23.1145 8.49922 23.432C8.81887 23.7494 9.2524 23.9277 9.70444 23.9277V23.9277C9.99591 23.9278 10.2825 23.8537 10.537 23.7125C10.7914 23.5713 11.0051 23.3677 11.1578 23.1211L14.5022 18.1898C14.5499 18.1188 14.57 18.033 14.5589 17.9484C14.5478 17.8638 14.5062 17.7861 14.4418 17.7295C14.3775 17.673 14.2947 17.6415 14.2087 17.641C14.1228 17.6404 14.0396 17.6707 13.9744 17.7264L10.6822 20.5622C10.6629 20.5794 10.639 20.5906 10.6134 20.5944C10.5878 20.5983 10.5617 20.5947 10.5381 20.5841C10.5145 20.5734 10.4946 20.5562 10.4807 20.5345C10.4669 20.5128 10.4597 20.4875 10.46 20.4618V11.5813C10.46 11.5541 10.4684 11.5276 10.4842 11.5053C10.4999 11.483 10.5221 11.4661 10.5478 11.4568C10.5735 11.4476 10.6015 11.4464 10.6279 11.4534C10.6544 11.4605 10.678 11.4755 10.6956 11.4963L20.6456 23.3286C20.8056 23.5163 21.0049 23.6671 21.2296 23.7706C21.4543 23.874 21.699 23.9277 21.9467 23.9277H22.2944C22.5184 23.9279 22.7401 23.8842 22.947 23.7992C23.154 23.7142 23.342 23.5895 23.5004 23.4324C23.6588 23.2752 23.7844 23.0885 23.8702 22.8831C23.9559 22.6776 24 22.4574 24 22.2351V9.73078C24 9.28185 23.8204 8.8513 23.5008 8.53386C23.1811 8.21642 22.7476 8.03809 22.2956 8.03809C22.0041 8.03801 21.7175 8.11211 21.4631 8.25332C21.2086 8.39453 20.9949 8.59814 20.8422 8.84471V8.84471Z" fill="white">
                    </path>
                  </g>
                  <defs>
                    <clipPath id="clip00033">
                      <rect width="16" height="16" fill="white" transform="translate(8 7.9834)">
                      </rect>
                    </clipPath>
                  </defs>
                </svg>
              </div>
              <div>
                <div style={{ display: "flex" }} >
                  <p style={{ margin: "0px", padding: "10px" }} >
                    NEAR
                  </p>
                  <p style={{ margin: "0px", padding: "10px" }} >
                    {balance}
                  </p>
                </div>
                <div style={{ display: "flex" }} >
                  <p style={{ margin: "0px", padding: "10px" }} >
                    ${walletData.price}
                  </p>
                  <p style={{ margin: "0px", padding: "10px" }} >
                    ≈ ${BalanceInUSd.toLocaleString(undefined, { maximumFractionDigits: 2 })} USD
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div style={active ? { display: "block" } : { display: "none" }}>
            <div style={{ border: "1px solid gray", width: "700px", height: "auto", borderRadius: "16px" }}>
              <div style={{ padding: "15px", display: "flex", alignItems: "center" }}

              >
                <svg
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    setActive(false)
                  }}
                  xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-arrow-left-circle" viewBox="0 0 16 16">
                  <path fill-rule="evenodd" d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8zm15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-4.5-.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H11.5z" />
                </svg>
                <p style={{ paddingLeft: "10px" }} >Back</p>
              </div>
              <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
                USD ${usdSum}
              </div>
              <div style={{ display: "flex", paddingTop: "20px" }} >
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
              <div style={{ display: "flex", justifyContent: "center", padding: "12px" }}>
                <div
                  style={{ backgroundColor: "black", color: "white", width: "150px", height: "35px", borderRadius: "16px", cursor: "pointer", display: "flex", justifyContent: "center", alignItems: "center" }}
                  onClick={async () => {
                    // sendToken()
                    await keyStore.setKey(networkId, sender, keyPair);
                    const near = await connect(config);
                    const senderAccount = await near.account(sender);
                    try {
                      const result = await senderAccount.sendMoney(receiver, amount);
                      dispatch({ type: "transaction", data: result.transaction })
                      sdk.notifier.success(`Sending ${utils.format.formatNearAmount(amount)}Ⓝ from ${sender} to ${receiver}...`)
                    } catch (error) {
                      sdk.notifier.error(`oops something went wrong`)
                    }
                  }}
                >Send</div>
              </div>
            </div>
            <div className='blockTransactions' >
              <p style={{ color: "gray" }} >Last Transactions</p>
              {
                walletData.transaction.map((el, index) => {

                  return (

                    <div style={{ margin: "8px", border: "1px solid green", borderRadius: "16px", display: "flex", justifyContent: "center", alignItems: "center" }} >
                      <svg style={{ color: "green" }} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-send-check" viewBox="0 0 16 16">
                        <path d="M15.964.686a.5.5 0 0 0-.65-.65L.767 5.855a.75.75 0 0 0-.124 1.329l4.995 3.178 1.531 2.406a.5.5 0 0 0 .844-.536L6.637 10.07l7.494-7.494-1.895 4.738a.5.5 0 1 0 .928.372l2.8-7Zm-2.54 1.183L5.93 9.363 1.591 6.602l11.833-4.733Z" />
                        <path d="M16 12.5a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Zm-1.993-1.679a.5.5 0 0 0-.686.172l-1.17 1.95-.547-.547a.5.5 0 0 0-.708.708l.774.773a.75.75 0 0 0 1.174-.144l1.335-2.226a.5.5 0 0 0-.172-.686Z" />
                      </svg>

                      {
                        el.actions.map((e, ind) => {
                          return (
                            <p style={{ color: "gray", paddingLeft: "8px" }}>
                              Sent {utils.format.formatNearAmount(e.Transfer.deposit)}Ⓝ to {el.receiver_id}
                            </p>
                          )
                        })
                      }

                    </div>
                  )
                })
              }
            </div>
          </div>
        </div>
        <div style={active ? { margin: "30px", display: "flex" } : { display: "none" }}
        >
          <div style={{ display: "flex", flexDirection: "column" }} >
            <TextInput
              placeholder='Enter Your ID To Get Methods'
              style={{ width: "220px" }}
              onChange={(e) => {
                dispatch({ type: "setContr", value: e.target.value })
              }}
            />
            <Button buttonType='success'
              style={{ width: "220px", marginTop: "12px" }}
              onClick={() => {
                ParseContract()
              }}
            >
              Parse Contract
            </Button>
          </div>
          <div style={{ width: "100%", paddingLeft: "12px" }} >
            <pre  >
           { JSON.stringify(method, undefined, 2)}
          </pre>
          </div>
        </div>

      </TabPanel>
    </>

  );
}



export function SidebarExtension(props) {
  useEffect(() => {
    return props.sdk.window.startAutoResizer();
  }, [props.sdk]);

  return (
    <>
      <Button
        buttonType='success'
        testId="open-page-extension"
        onClick={() => {
          props.sdk.navigator.openPageExtension({ path: '/' });
        }}>
        Connect Wallet
      </Button>
    </>
  );
}

SidebarExtension.propTypes = {
  sdk: PropTypes.object.isRequired
};

init(sdk => {
  if (sdk.location.is(locations.LOCATION_PAGE)) {
    render(<Provider store={store}>
      <MainPage sdk={sdk} />
    </Provider>, document.getElementById('root'));
  } else if (sdk.location.is(locations.LOCATION_ENTRY_SIDEBAR)) {
    render(<Provider store={store} >
      <SidebarExtension sdk={sdk} />
    </Provider>, document.getElementById('root'));
  } else {
    return null;
  }
});


