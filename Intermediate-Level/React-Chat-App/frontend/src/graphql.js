import gql from 'graphql-tag';

export const CHATS_QUERY = gql`
  query {
    chats {
      id
      from
      message
    }
  }
`;

export const SEND_MESSAGE_MUTATION = gql`
  mutation ($from: String!, $message: String!) {
    sendMessage(
      from: $from,
      message: $message
    ) {
      id
      from
      message
    }
  }
`;

export const MESSAGE_SENT_SUBSCRIPTION = gql`
  subscription {
    messageSent {
      id
      from
      message
    }
  }
`;
