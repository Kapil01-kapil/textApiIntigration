import React, { Component } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  TextInput,
  TouchableOpacity,
  Animated,
  Keyboard,
} from "react-native";
import BtnWithImage from "../../components/btn_with_image";
import AssetsImages from "../../res";
import SafeAreaContainer from "../../components/safearea_container";
import styles from "./styles";
import PaymentMethodView from "../../components/payment_method_view";
import TxtFullScreenBtn from "../../components/txt_full_screen_btn";
import HeaderTxt from "../../components/header_txt";
import { connect } from "react-redux";
import Mixpanel from "react-native-mixpanel";
import {
  card_list,
  card_list_clear_data,
  payment_delete_clear_data,
  payment_delete,
  make_card_default,
  make_card_default_clear_data,
} from "../../redux/actions";
import Loader from "../../components/loader";
import {
  FreshChat_APP_ID,
  FreshChat_APP_KEY,
  PROJECT_TOKEN,
  API_secret,
} from "../../api/api_config";
import {
  Freshchat,
  FreshchatConfig,
  FaqOptions,
  ConversationOptions,
  FreshchatUser,
  FreshchatMessage,
  FreshchatNotificationConfig,
} from "react-native-freshchat-sdk";
class Payment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "",
      bodyTxt: "",
      isPopUpOpened: false,
      isContainingTwoBtn: true,
      firstBtnTitle: "REMOVE",
      secondBtnTitle: "NO THANKS",
      saved_cards: [],
      isFromAddVehicle: false,
      onPressFirstBtn: "",
      loading: false,
      isApiCalled: false,
      isFromMembership: false,
      orderData: {},
    };
  }

  //TODO:- class life cycle
  componentDidMount() {
    Mixpanel.sharedInstanceWithToken(PROJECT_TOKEN, false, true, true, null);

    this.props.navigation.setOptions({
      headerTitle: "Payment",
      headerStyle: {
        elevation: 0,
        shadowOpacity: 0,
        borderBottomWidth: 0,
      },
      headerTitleStyle: {
        fontWeight: "bold",
        fontSize: 26,
        fontFamily: "Avenir",
        alignSelf: "center",
      },
      headerLeft: () => (
        <BtnWithImage
          img={AssetsImages.icon_sidemenu}
          btnImgStyle={{ height: 22, width: 22 }}
          onPress={() => {
            this.props.navigation.openDrawer();
          }}
          btnStyle={{ marginLeft: 8 }}
        />
      ),
      headerRight: () => (
        <BtnWithImage
          img={AssetsImages.icon_chat}
          btnImgStyle={{ height: 18, width: 18 }}
          onPress={() => {
            // this.props.navigation.openDrawer();
          }}
          btnStyle={{ marginRight: 8 }}
        />
      ),
    });

    var requestData = {
      user_id: this.props.user_data.data._id,
    };
    this.props.card_list(requestData);
    console.log(
      "this.props.route.params.isFromAddVehicle  => " +
        JSON.stringify(this.props)
    );

    this._unsubscribe = this.props.navigation.addListener("focus", () => {
      this.onFocus();
    });
  }

  onFocus = () => {
    var requestData = {
      user_id: this.props.user_data.data._id,
    };
    this.props.card_list(requestData);
  };

  componentDidUpdate(prevProps) {
    if (this.props.is_ !== prevProps._delete) {
      if (this.props._delete) {
        if (!this.state.isApiCalled) {
          this.setState({ loading: true });
        }
      } else if (!this.props._delete) {
        this.setState({ loading: false, isApiCalled: true });
      }
    }
    if (this.props.is_fetching !== prevProps.is_fetching) {
      if (this.props.is_fetching) {
        if (!this.state.isApiCalled) {
          this.setState({ loading: true });
        }
      } else if (!this.props.is_fetching) {
        this.setState({ loading: false, isApiCalled: true });
      }
      if (this.props.is_success !== prevProps.is_success) {
        if (this.props.is_success == true) {
          console.log("DATA====>", this.props.card_list_data);
          this.setState({ saved_cards: this.props.card_list_data });
          this.props.card_list_clear_data();
        }
      }
    }

    /// kapil delete_payment

    if (
      this.props.is_fetching_delete_payment !==
      prevProps.is_fetching_delete_payment
    ) {
      if (this.props.is_fetching_delete_payment) {
        if (!this.state.isApiCalled) {
          this.setState({ loading: true });
        }
      } else if (!this.props._delete) {
        this.setState({ loading: false, isApiCalled: true });
      }
    }

    if (
      this.props.is_success_delete_payment !==
      prevProps.is_success_delete_payment
    ) {
      console.log("payment_Successs", this.props.is_success_delete_payment);
      if (this.props.is_success_delete_payment == true) {
        console.log("DATA====>", this.props.card_list_data);
        var requestData = {
          user_id: this.props.user_data.data._id,
        };
        this.props.card_list(requestData);
        this.props.payment_delete_clear_data();
        this.props.card_list_clear_data();
        this.props.make_card_default_clear_data();
      }
    }

    ///sceess delete_payment

    if (
      this.props.is_fetching_delete_payment !==
      prevProps.is_fetching_delete_payment
    ) {
      if (this.props.is_fetching_delete_payment) {
        this.setState({ loading: true });
      } else if (!this.props.is_fetching_delete_payment) {
        this.setState({ loading: false }, () => {
          if (
            this.props.is_success_delete_payment !==
            prevProps.is_success_delete_payment
          ) {
            console.log("prevProps => " + prevProps.is_success_delete_payment);
            console.log("this.props => " + this.props.card_list_data);

            if (this.props.is_success_delete) {
              var requestData = {
                user_id: this.props.user_data.data._id,
              };
              this.props.card_list(requestData);

              this.props.payment_delete_clear_data();
              this.props.card_list_clear_data();
              this.props.make_card_default_clear_data();
            }
          }
        });
      }
    }

    /// kapil delete_payment

    if (
      this.props.is_fetching_make_card_default !==
      prevProps.is_fetching_make_card_default
    ) {
      if (this.props.is_fetching_make_card_default) {
        this.setState({ loading: true });
      } else if (!this.props.is_fetching_make_card_default) {
        this.setState({ loading: false, isApiCalled: true });
      }
    }

    if (
      this.props.is_success_make_card_default !==
      prevProps.is_success_make_card_default
    ) {
      if (this.props.is_success_make_card_default) {
        if (this.state.isFromAddVehicle && !this.state.isFromMembership) {
          this.state.isFromAddVehicle &&
            this.props.navigation.navigate("Schedule", {
              orderData: this.state.orderData,
            });
        } else {
          this.state.isFromMembership &&
            this.props.navigation.navigate("Membership", {
              orderData: "",
            });
        }
      }
      this.props.make_card_default_clear_data();
    }
  }

  // onPressSecondBtn = () => {
  //     this.setState({isPopUpOpened: true})
  // }

  paymentHeader = () => {
    return (
      <View style={{ width: "100%" }}>
        {this.state.saved_cards.length != 0 ? (
          <HeaderTxt
            title={"Saved Payment Methods"}
            marginTop={40}
            marginBottom={10}
          />
        ) : null}
      </View>
    );
  };

  paymentFooter = () => {
    //View to set in Footer
    return (
      <View style={{ width: "100%" }}>
        <TxtFullScreenBtn
          title={"Add a Payment Method"}
          onPress={() => {
            this.props.navigation.navigate("SelectPayment", {
              orderData: this.state.orderData,
              is_selected_home: "",
              carddata: "",
              isFromAddVehicle: this.state.isFromAddVehicle,
              isFromMembership: this.state.isFromMembership,
            });
          }}
          // disabled={this.state.is_btn_disabled || !this.state.is_error_msg_shown ? true : false}
          containerStyle={{
            backgroundColor: "#FFE0CC",
            marginTop: 20,
            marginBottom: 20,
            shadowRadius: 1,
          }}
          fontColor={"#FF6600"}
        />
      </View>
    );
  };

  render() {
    return (
      <SafeAreaContainer
        title={this.state.title}
        bodyTxt={this.state.bodyTxt}
        isModalOpened={this.state.isPopUpOpened}
        onDismiss={() => {
          this.setState({ isPopUpOpened: false });
        }}
        isContainingTwoBtn={this.state.isContainingTwoBtn}
        firstBtnTitle={this.state.firstBtnTitle}
        onPressFirstBtn={() => {
          this.setState({ isPopUpOpened: false });
          this.props.payment_delete({
            user_id: this.props.user_data.data._id,
            customer_id: this.props.user_data.data.stripe_id,
            card_id: this.state.onPressFirstBtn,
          });
        }}
        secondBtnTitle={this.state.secondBtnTitle}
        onPressSecondBtn={() => {
          this.setState({ isPopUpOpened: false });
        }}
      >
        <Loader loading={this.state.loading} />

        <View style={styles.container}>
          <FlatList
            style={{ width: "100%" }}
            data={this.state.saved_cards}
            keyExtractor={(item, index) => index.toString()}
            ListHeaderComponent={this.paymentHeader()}
            ListFooterComponent={this.paymentFooter()}
            renderItem={({ item }) => {
              return (
                <PaymentMethodView
                  img={item.img}
                  card_no={item.last4}
                  card_data={"EXP " + item.exp_month + "/" + item.exp_year}
                  onPressBtn={() => {
                    if (
                      !this.state.isFromAddVehicle ||
                      !this.state.isFromMembership
                    ) {
                      this.setState({
                        onPressFirstBtn: item.card_id,
                        isPopUpOpened: true,
                        title: "Remove Payment Method",
                        bodyTxt:
                          "You are about to remove this payment method from your service profile.",
                      });
                    } else {
                      if (
                        this.state.isFromAddVehicle &&
                        !this.state.isFromMembership
                      ) {
                        //this.state.orderData.payment_data = item;
                        var requestData = {
                          customer_id: this.props.user_data.data.stripe_id,
                          card_id: item.id,
                        };
                        //  this.props.make_card_default(requestData);

                        this.props.navigation.navigate("Schedule", {
                          orderData: this.props.route.params.orderData,
                          is_selected_home: this.props.route.params
                            .is_selected_home,
                          paymentmethod: "card",
                        });
                      } else {
                        if (
                          !this.state.isFromAddVehicle &&
                          this.state.isFromMembership
                        ) {
                          //this.state.orderData.payment_data = item;
                          var requestData = {
                            customer_id: this.props.user_data.data.stripe_id,
                            card_id: item.id,
                          };
                          //  this.props.make_card_default(requestData);

                          this.props.navigation.navigate("Membership", {
                            requestData: requestData,
                            paymentmethod: "card",
                          });
                        }
                      }
                    }
                  }}
                  onPressPayment={() => {
                    if (
                      this.state.isFromAddVehicle &&
                      !this.state.isFromMembership
                    ) {
                      //   this.state.orderData.payment_data = item;
                      var requestData = {
                        customer_id: this.props.user_data.data.stripe_id,
                        card_id: item,
                      };
                      //this.props.make_card_default(requestData);

                      this.props.navigation.navigate("Schedule", {
                        orderData: this.props.route.params.orderData,
                        is_selected_home: this.props.route.params
                          .is_selected_home,
                        paymentmethod: "card",
                        carddata: requestData,
                      });
                    } else if (
                      !this.state.isFromAddVehicle &&
                      this.state.isFromMembership
                    ) {
                      //   this.state.orderData.payment_data = item;
                      var requestData = {
                        customer_id: this.props.user_data.data.stripe_id,
                        card_id: item,
                      };
                      //this.props.make_card_default(requestData);

                      this.props.navigation.navigate("Membership", {
                        requestData: requestData,
                        paymentmethod: "card",
                      });
                    }
                  }}
                  BtnImg={
                    this.state.isFromAddVehicle
                      ? AssetsImages.icon_add_active
                      : AssetsImages.icon_remove
                  }
                />
              );
            }}
          />
        </View>
      </SafeAreaContainer>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  card_list: (request_data) => dispatch(card_list(request_data)),
  card_list_clear_data: () => dispatch(card_list_clear_data()),
  /// kapil delete_payment
  payment_delete: (request_data) => dispatch(payment_delete(request_data)),
  payment_delete_clear_data: () => dispatch(payment_delete_clear_data()),

  make_card_default: (request_data) =>
    dispatch(make_card_default(request_data)),
  make_card_default_clear_data: () => dispatch(make_card_default_clear_data()),
});

const mapStateToProps = (state) => ({
  card_list_data: state.card_list.card_list_data,

  is_success: state.card_list.is_success,
  is_fetching: state.card_list.is_fetching,
  msg: state.card_list.msg,

  user_data: state.user_auth.user_data,
  /// kapil delete_payment
  is_success_delete_payment: state.payment_delete.is_success,
  is_fetching_delete_payment: state.payment_delete.is_fetching,
  msg_delete_payment: state.payment_delete.msg,

  make_card_default_data: state.make_card_default.make_card_default_data,
  is_success_make_card_default: state.make_card_default.is_success,
  is_fetching_make_card_default: state.make_card_default.is_fetching,
  msg_make_card_default: state.make_card_default.msg,
});

export default connect(mapStateToProps, mapDispatchToProps)(Payment);
