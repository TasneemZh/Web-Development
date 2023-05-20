/* eslint-disable react/prop-types */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/no-array-index-key */
import React from 'react';

const ChatHistory = class extends React.PureComponent {
  componentDidMount() {
    this.props.subscribeToMore();
  }

  render() {
    const { chats } = this.props;
    return (
      <div>
        { chats.map((chat, index) => (
          <dl key={index}>
            <dt>{chat.from}</dt>
            <dd>{chat.message}</dd>
          </dl>
        ))}
      </div>
    );
  }
};
export default ChatHistory;
