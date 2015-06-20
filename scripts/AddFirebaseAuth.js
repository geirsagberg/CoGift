import { Component } from 'react';
import defaultFirebase from './firebase';

export default (SubComponent, firebase = defaultFirebase) => class extends Component {
  constructor() {
    this.state = { user: null };
  }
  componentDidMount() {
    firebase.onAuth(authData => {
      if (authData === null) {
        this.setState({
          user: null
        });
      } else {
        firebase.child(`userMappings/${authData.uid}`).once('value', value => {
          var userId = value.val();
          if (!userId) {
            var user = firebase.child(`users`).push();
            userId = user.key();
            user.child(`userMappings/${authData.provider}`).set(authData.uid);
            this.props.firebase.child(`userMappings/${authData.uid}`).set(userId);
          }

          this.setState({
            user: authData
          });
          this.bindAsArray(this.giftData, 'gifts');
        });
      }
    });
  }
  render(){
    return <SubComponent {...this.props} {...this.state} />;
  }
};
