import React, { useState } from 'react';
import { Query } from 'react-apollo';
import axios from 'axios';
import ChatHistory from './ChatHistory';

import {
  CHATS_QUERY,
  SEND_MESSAGE_MUTATION,
  MESSAGE_SENT_SUBSCRIPTION,
} from './graphql';

function Messaging() {
  const [username, updateUsername] = useState('');
  const [message, updateMessage] = useState('');
  const [entered, updateEntered] = useState(false);
  const [chats, addToChat] = useState([]);

  const enterChat = async (e) => {
    updateEntered(username !== '');
    e.preventDefault();
  };

  const sendMessage = async () => {
    if (message !== '') {
      await axios.post('http://localhost:4000/graphql', {
        query: SEND_MESSAGE_MUTATION,
        variables: {
          from: username,
          message,
        },
      });

      updateMessage('');
    }
  };

  return (
    <div id="app" className="container" style={{ paddingTop: '100px' }}>
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card">
            <div className="card-body">
              {entered ? (
                <div className="row">
                  <div className="col-md-12">
                    <div className="card">
                      <div className="card-header">Chatbox</div>
                      <div className="card-body">
                        <Query query={CHATS_QUERY}>
                          {({
                            loading, subscribeToMore,
                          }) => {
                            if (loading) return <p>Loading...</p>;
                            const more = () => subscribeToMore({
                              document: MESSAGE_SENT_SUBSCRIPTION,
                              updateQuery: (prev, { subscriptionData }) => {
                                if (!subscriptionData.data) return prev.chats;
                                return addToChat((previous) => [...previous,
                                  subscriptionData.data.messageSent]);
                              },
                            });
                            return <ChatHistory chats={chats} subscribeToMore={more} />;
                          }}
                        </Query>
                        <hr />
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Type your message..."
                          v-model="message"
                          value={message}
                          onChange={(e) => {
                            updateMessage(e.target.value);
                          }}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              sendMessage();
                            }
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="row">
                  <div className="col-md-12">
                    <form method="post" onSubmit={enterChat}>
                      <div className="form-group">
                        <div className="input-group">
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Enter your username"
                            v-model="username"
                            value={username}
                            onChange={(e) => {
                              updateUsername(e.target.value);
                            }}
                          />

                          <div className="input-group-append">
                            <button type="submit" className="btn btn-primary" onClick={enterChat}>Enter</button>
                          </div>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Messaging;
