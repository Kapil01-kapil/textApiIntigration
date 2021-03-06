import React, { Component } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  ScrollView,
  TouchableOpacity,
  Animated,
  Keyboard,
} from "react-native";
import BtnWithImage from "../../components/btn_with_image";
import AssetsImages from "../../res";
import SafeAreaContainer from "../../components/safearea_container";
import styles from "./styles";
import HeaderTxt from "../../components/header_txt";
import TxtFullScreenBtn from "../../components/txt_full_screen_btn";
import { connect } from "react-redux";
import {
  Freshchat,
  FreshchatConfig,
  FaqOptions,
  ConversationOptions,
  FreshchatUser,
  FreshchatMessage,
  FreshchatNotificationConfig,
} from "react-native-freshchat-sdk";
import {
  FreshChat_APP_ID,
  FreshChat_APP_KEY,
  PROJECT_TOKEN,
  API_secret,
} from "../../api/api_config";
import Mixpanel from "react-native-mixpanel";
import {
  saved_vehicle,
  saved_vehicle_clear_data,
  delete_vehicle,
  delete_vehicle_clear_data,
} from "../../redux/actions";
import Loader from "../../components/loader";
import { CONST } from "../../utils/constants";
import helper from "../../utils/helper";

class Vehicles extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "",
      bodyTxt: "",
      isPopUpOpened: false,
      loading: false,
      onPressFirstBtn: "",
      isContainingTwoBtn: true,
      firstBtnTitle: "REMOVE",
      secondBtnTitle: "NO THANKS",
      is_boat_seleted: false,
      automobiles_list: [],
      refresh_automobiles_list: true,
      boat_list: [],
      refresh_boat_list: true,
      isApiCalled: false,
    };
  }

  //TODO:- class life cycle
  componentDidMount() {
    this.props.navigation.setOptions({
      headerTitle: "Vehicles",
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
            Freshchat.showFAQs();
            //this.setupUserFreshchat;
            // this.resetUserFreshchat;
            Freshchat.showConversations();
          }}
          btnStyle={{ marginRight: 8 }}
        />
      ),
    });
    let request = {
      user_id:
        this.props && this.props.user_data && this.props.user_data.data._id,
    };
    this.props.saved_vehicle(request);
    this._unsubscribe = this.props.navigation.addListener("focus", () => {
      this.onFocus();
    });
  }

  onFocus = () => {
    let request = {
      user_id:
        this.props && this.props.user_data && this.props.user_data.data._id,
    };
    this.props.saved_vehicle(request);
  };

  componentWillUnmount() {
    this._unsubscribe();
  }

  componentDidUpdate(prevProps) {
    console.log(
      "prevProps => " +
        JSON.stringify(prevProps) +
        "   ======  " +
        this.props.msg
    );
    if (this.props.is_ !== prevProps._delete) {
      if (this.props._delete) {
        if (!this.state.isApiCalled) {
          this.setState({ loading: true });
        }
      } else if (!this.props._delete) {
        this.setState({ loading: false, isApiCalled: true });
      }
    }

    if (this.props.is_fetching_delete !== prevProps.is_fetching_delete) {
      if (this.props.is_fetching_delete) {
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
    }
    if (this.props.is_success !== prevProps.is_success) {
      if (this.props.is_success == true) {
        console.log("DATA====>", this.props.delete_vehicle_data);
      }
    }

    if (this.props.is_success_delete !== prevProps.is_success_delete) {
      if (this.props.is_success == true) {
        console.log("DATA====>", this.props.saved_vehicle_data);
        this.props.delete_vehicle_clear_data();
      }
    }

    if (this.props.is_fetching_delete !== prevProps.is_fetching_delete) {
      if (this.props.is_fetching_delete) {
        this.setState({ loading: true });
      } else if (!this.props.is_fetching_delete) {
        this.setState({ loading: false }, () => {
          if (this.props.is_success_delete !== prevProps.is_success_delete) {
            if (this.props.is_success_delete) {
              console.log(
                "DATAhtdjjgkhlkjk" +
                  JSON.stringify(this.props.saved_vehicle_data)
              );
              let request = {
                user_id:
                  this.props &&
                  this.props.user_data &&
                  this.props.user_data.data._id,
              };
              this.props.saved_vehicle(request);

              this.props.saved_vehicle_clear_data();
              this.props.delete_vehicle_clear_data();
            }
          }
        });
      }
    }

    if (this.props.is_success !== prevProps.is_success) {
      if (this.props.is_success == true) {
        if (!helper.isEmptyObject(this.props.saved_vehicle_data)) {
          var autoData = [];
          var boatDate = [];
          this.props.saved_vehicle_data.data.map((item, index) => {
            if (item.type == "auto") {
              autoData.push(item);
            } else {
              boatDate.push(item);
            }
          });
          this.setState({ automobiles_list: autoData, boat_list: boatDate });

          this.setState(
            {
              refresh_automobiles_list: !this.state.refresh_automobiles_list,
              refresh_boat_list: !this.state.refresh_boat_list,
            },
            () => {
              console.log(
                "success => " + JSON.stringify(this.props.automobiles_list)
              );
              console.log("success => " + JSON.stringify(this.props.boat_list));
            }
          );
        }

        this.props.saved_vehicle_clear_data();
      }
    }
  }

  automobilesHeader = () => {
    return (
      <View style={{ width: "100%" }}>
        <HeaderTxt title={"My Automobiles"} marginTop={16} marginBottom={5} />
      </View>
    );
  };

  automobilesFooter = () => {
    //View to set in Footer
    return (
      <View style={{ width: "100%" }}>
        <TxtFullScreenBtn
          title={"Add a Automobiles"}
          onPress={() => {
            this.props.navigation.navigate("AddVehicle", {
              isFrom: "SavedVehile",
              is_boat_seleted: false,
            });
          }}
          // disabled={this.state.is_btn_disabled || !this.state.is_error_msg_shown ? true : false}
          containerStyle={{
            backgroundColor: "#FFE0CC",
            marginTop: 15,
            shadowOpacity: 0,
          }}
          fontColor={"#FF6600"}
        />
      </View>
    );
  };

  boatHeader = () => {
    return (
      <View style={{ width: "100%" }}>
        <HeaderTxt title={"My Boats"} marginTop={16} />
      </View>
    );
  };

  boatFooter = () => {
    //View to set in Footer
    return (
      <View style={{ width: "100%" }}>
        <TxtFullScreenBtn
          title={"Add a Boat"}
          onPress={() => {
            this.props.navigation.navigate("AddVehicle", {
              isFrom: "SavedVehile",
              is_boat_seleted: true,
            });
          }}
          // disabled={this.state.is_btn_disabled || !this.state.is_error_msg_shown ? true : false}
          containerStyle={{
            backgroundColor: "#FFE0CC",
            marginTop: 15,
            shadowOpacity: 0,
            marginBottom: 20,
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
          let request = {
            user_id:
              this.props &&
              this.props.user_data &&
              this.props.user_data.data._id,
          };
          this.props.saved_vehicle(request);
          console.log("id==>", this.state.onPressFirstBtn);
          this.props.delete_vehicle({
            user_id:
              this.props &&
              this.props.user_data &&
              this.props.user_data.data._id,
            user_token:
              this.props &&
              this.props.user_data &&
              this.props.user_data.data.user_token,
            vehicle_id:
              this.props && this.props.user_data && this.state.onPressFirstBtn,
          });
        }}
        secondBtnTitle={this.state.secondBtnTitle}
        onPressSecondBtn={() => {
          this.setState({ isPopUpOpened: false });
        }}
      >
        <Loader loading={this.state.loading} />

        <ScrollView style={styles.container}>
          <View>
            <HeaderTxt title={"Vehicle Type"} marginTop={30} />
            <View
              style={{
                flexDirection: "row",
                width: "86%",
                alignItems: "center",
                justifyContent: "space-between",
                alignSelf: "center",
                marginTop: 8,
              }}
            >
              <TouchableOpacity
                style={{
                  height: 100,
                  width: "48%",
                  alignItems: "center",
                  justifyContent: "center",
                  borderColor: !this.state.is_boat_seleted
                    ? "#FF5C22"
                    : "#D1D2D4",
                  borderWidth: 1,
                  borderRadius: 5,
                  backgroundColor: !this.state.is_boat_seleted
                    ? "#FFF5EC"
                    : "#FFF",
                }}
                onPress={() => {
                  this.setState({ is_boat_seleted: false });
                }}
                activeOpacity={1}
              >
                <Image
                  style={{
                    height: "52%",
                    width: "52%",
                    resizeMode: "contain",
                  }}
                  source={
                    !this.state.is_boat_seleted
                      ? AssetsImages.icon_auto_active
                      : AssetsImages.icon_auto_inactive
                  }
                />
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: "700",
                    color: !this.state.is_boat_seleted ? "#FF5C22" : "#D1D2D4",
                    marginTop: 8,
                  }}
                >
                  AUTO
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  height: 100,
                  width: "48%",
                  alignItems: "center",
                  justifyContent: "center",
                  borderColor: this.state.is_boat_seleted
                    ? "#FF5C22"
                    : "#D1D2D4",
                  borderWidth: 1,
                  borderRadius: 5,
                  backgroundColor: this.state.is_boat_seleted
                    ? "#FFF5EC"
                    : "#FFF",
                }}
                onPress={() => {
                  this.setState({ is_boat_seleted: true });
                }}
                activeOpacity={1}
              >
                <Image
                  style={{
                    height: "52%",
                    width: "50%",
                    resizeMode: "contain",
                  }}
                  source={
                    this.state.is_boat_seleted
                      ? AssetsImages.icon_boat_active
                      : AssetsImages.icon_boat_inactive
                  }
                />
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: "700",
                    color: this.state.is_boat_seleted ? "#FF5C22" : "#D1D2D4",
                    marginTop: 8,
                  }}
                >
                  BOAT
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          {!this.state.is_boat_seleted &&
          this.state.automobiles_list.length != 0 ? (
            <FlatList
              style={{ width: "100%", marginTop: 5 }}
              data={this.state.automobiles_list}
              keyExtractor={(item, index) => index.toString()}
              extraData={this.state.refresh_automobiles_list}
              renderItem={({ item }) => {
                return (
                  <TouchableOpacity
                    style={{
                      flexDirection: "row",
                      width: "86%",
                      alignItems: "center",
                      justifyContent: "space-between",
                      alignSelf: "center",
                      marginVertical: 5,
                      borderRadius: 5,
                      borderColor: "#D9DAE3",
                      borderWidth: 1,
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        marginLeft: 10,
                        marginVertical: 8,
                      }}
                    >
                      <Text
                        style={{
                          marginLeft: 6,
                          fontSize: 13,
                          fontWeight: "500",
                          fontFamily: "Avenir",
                          color: "#8B90AA",
                        }}
                      >
                        {item.make}
                      </Text>
                    </View>
                    <TouchableOpacity
                      style={{
                        height: 40,
                        width: 40,
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                      onPress={() => {
                        this.setState({
                          onPressFirstBtn: item._id,
                          isPopUpOpened: true,
                          title: "Remove Vehicle",
                          bodyTxt:
                            "You are about to remove this vehicle from your service profile.",
                        });
                      }}
                    >
                      <Image
                        source={AssetsImages.icon_remove}
                        style={{ height: 16, width: 16 }}
                      />
                    </TouchableOpacity>
                  </TouchableOpacity>
                );
              }}
            />
          ) : null}

          {this.state.is_boat_seleted && this.state.boat_list.length != 0 ? (
            <FlatList
              style={{ width: "100%", marginTop: 5 }}
              data={this.state.boat_list}
              keyExtractor={(item, index) => index.toString()}
              //  extraData={this.state.refresh_boat_list}
              renderItem={({ item }) => {
                return (
                  <View
                    style={{
                      flexDirection: "row",
                      width: "86%",
                      alignItems: "center",
                      justifyContent: "space-between",
                      alignSelf: "center",
                      marginVertical: 5,
                      borderRadius: 5,
                      borderColor: "#D9DAE3",
                      borderWidth: 1,
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        marginLeft: 10,
                        marginVertical: 8,
                      }}
                    >
                      <Text
                        style={{
                          marginLeft: 6,
                          fontSize: 13,
                          fontWeight: "500",
                          fontFamily: "Avenir",
                          color: "#8B90AA",
                        }}
                      >
                        {item.make}
                      </Text>
                    </View>
                    <TouchableOpacity
                      style={{
                        height: 40,
                        width: 40,
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                      onPress={() => {
                        this.setState({
                          onPressFirstBtn: item._id,
                          isPopUpOpened: true,
                          title: "Remove Vehicle",
                          bodyTxt:
                            "You are about to remove this vehicle from your service profile.",
                        });
                      }}
                    >
                      <Image
                        source={AssetsImages.icon_remove}
                        style={{ height: 16, width: 16 }}
                      />
                    </TouchableOpacity>
                  </View>
                );
              }}
            />
          ) : null}
          <View style={{ width: "100%" }}>
            <TxtFullScreenBtn
              title={
                this.state.is_boat_seleted ? "Add a Boat" : "Add a Automobiles"
              }
              onPress={() => {
                if (this.state.is_requested_for_home) {
                  this.props.navigation.navigate("AddVehicle", {
                    is_selected_home: this.state.is_selected_home,
                    isFrom: "SelectVehicle",
                    is_boat_seleted: this.state.is_boat_seleted,
                  });
                } else {
                  this.props.navigation.navigate("AddVehicle", {
                    is_selected_home: this.state.is_selected_home,
                    isFrom: "SelectVehicle",
                    is_boat_seleted: this.state.is_boat_seleted,
                  });
                }
              }}
              // disabled={this.state.is_btn_disabled || !this.state.is_error_msg_shown ? true : false}
              containerStyle={{
                backgroundColor: "#FFE0CC",
                marginTop: 15,
                shadowOpacity: 0,
              }}
              fontColor={"#FF6600"}
            />
          </View>
        </ScrollView>
      </SafeAreaContainer>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  saved_vehicle: (request_data) => dispatch(saved_vehicle(request_data)),
  saved_vehicle_clear_data: () => dispatch(saved_vehicle_clear_data()),

  delete_vehicle: (request_data) => dispatch(delete_vehicle(request_data)),
  delete_vehicle_clear_data: () => dispatch(delete_vehicle_clear_data()),
});

const mapStateToProps = (state) => ({
  is_success: state.saved_vehicle.is_success,
  is_fetching: state.saved_vehicle.is_fetching,
  msg: state.saved_vehicle.msg,

  saved_vehicle_data: state.saved_vehicle.saved_vehicle_data,
  user_data: state.user_auth.user_data,

  is_success_delete: state.delete_vehicle.is_success,
  is_fetching_delete: state.delete_vehicle.is_fetching,
  msg_delete: state.saved_vehicle.msg,

  delete_vehicle_data: state.delete_vehicle.delete_vehicle_data,
});

export default connect(mapStateToProps, mapDispatchToProps)(Vehicles);
