import React from 'react';
import { Text, View, TouchableOpacity, StyleSheet, TextInput, Image } from 'react-native';
import * as Permissions from 'expo-permissions';
import { BarCodeScanner } from 'expo-barcode-scanner';
import db from "../config"

export default class TransactionScreen extends React.Component {
    constructor(){
      super();
      this.state = {
        hasCameraPermissions: null,
        scanned: false,
        scannedData: '',
        buttonState: 'normal',
        scannedBookID: '',
        scannedStudentID: '',
        transanctionMessage: '',

      }
    }

    getCameraPermissions = async (id) =>{
      const {status} = await Permissions.askAsync(Permissions.CAMERA);
      
      this.setState({
        /*status === "granted" is true when user has granted permission
          status === "granted" is false when user has not granted the permission
        */
        hasCameraPermissions: status === "granted",
        buttonState: id,
        scanned: false

      });
    }

    handleBarCodeScanned = async({type, data})=>{
      const {buttonState} = this.state
      if(buttonState === 'BookId'){
        this.setState({
            scanned: true,
            scannedBookID: data,
            buttonState: 'normal',
          });
      }
      
      else if(buttonState === "StudentId"){
        this.setState({
            scanned: true,
            scannedStudentID: data,
            buttonState: 'normal',
          });
      }

    }

    initiateBookIssue =async()=>{
      db.collection('transanction').add({
        'studentId': this.state.scannedStudentID,
        'bookId': this.state.scannedBookID,
        'date':firbase.firestore.Timestamp.now().toDate(),
        'transanctionType':'Issue'
        
      })
//change the book status
        db.collection('books').doc(this.state.scannedBookID).update({
          'bookAvailability':false
        })

        //change number of issued books for student
        db.collection('students').doc(this.state.scannedStudentID).update({
          'noOfBookIssued':firebase.firestore.FieldValue.increment(1)

        })

        this.setState({
          scannedStudentID:'',
          scannedBookID:'',
        })
    }
    
    initiateBookReturn =async()=>{
      db.collection('transanction').add({
        'studentId': this.state.scannedStudentID,
        'bookId': this.state.scannedBookID,
        'date':firbase.firestore.Timestamp.now().toDate(),
        'transanctionType':'Return'
        
      })
//change the book status
        db.collection('books').doc(this.state.scannedBookID).update({
          'bookAvailability':true
        })

        //change number of issued books for student
        db.collection('students').doc(this.state.scannedStudentID).update({
          'noOfBookIssued':firebase.firestore.FieldValue.increment(-1)

        })

        this.setState({
          scannedStudentID:'',
          scannedBookID:'',
        })
    }

      handleTransanction =async()=>{
        var transanctionMessage = null
        db.collection('books').doc(this.state.scannedBookID).get()
        .then((doc)=>{
          var book = doc.data()
          if(book.bookAvailability){
            this.initiateBookIssue()
            transanctionMessage='bookIssued'
          }
          else{
            this.initiateBookReturn()
            transanctionMessage='bookReturned'
          }
        })
        this.setState({
          transanctionMessage:transanctionMessage
        })
    }

  

    render() {
      const hasCameraPermissions = this.state.hasCameraPermissions;
      const scanned = this.state.scanned;
      const buttonState = this.state.buttonState;

      if (buttonState !== "normal" && hasCameraPermissions){
        return(
          <BarCodeScanner
            onBarCodeScanned={scanned ? undefined : this.handleBarCodeScanned}
            style={StyleSheet.absoluteFillObject}
          />
        );
      }

      else if (buttonState === "normal"){
        return(
          <View style={styles.container}>
              <View>
                  <Image
                    source={require('../assets/booklogo.jpg')}
                    style={{
                        width:200,
                        height:200
                    }}
                  />
                  <Text style={{
                      textAlign:"center",
                      fontSize:30
                  }}>Wily</Text>
              </View>
              <View style={styles.inputView}>
          <TextInput
          style={styles.inputBox}
          placeholder="Books ID"
          value={this.state.scannedBookID}
          />
          
          <TouchableOpacity style={styles.scanButton}
          onPress={()=>{
            this.getCameraPermissions("BookId")
          }}
          >
            <Text style={styles.buttonText}>Scan</Text>
          </TouchableOpacity>

          </View>

          <View style={styles.inputView}>
          <TextInput
          style={styles.inputBox}
          placeholder="Students ID"
          value={this.state.scannedStudentID}
          />
          
          <TouchableOpacity style={styles.scanButton}
          onPress={()=>{
            this.getCameraPermissions("StudentId")
          }}
          >
            <Text style={styles.buttonText}>Scan</Text>
          </TouchableOpacity>

          </View>
          <TouchableOpacity style={styles.submitButton}
          onPress={async()=>{
            this.handleTransanction()
          }}>
          <Text style={styles.submitButtonText}>Submit</Text>
          </TouchableOpacity>
        </View>
        );
      }
    }
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center'
    },
    displayText:{
      fontSize: 15,
      textDecorationLine: 'underline'
    },
    buttonText:{
      fontSize: 15,
      textAlign: 'center',
      marginTop: 10
    },
    inputView:{
      flexDirection: 'row',
      margin: 20
    },
    inputBox:{
      width: 200,
      height: 40,
      borderWidth: 1.5,
      borderRightWidth: 0,
      fontSize: 20
    },
    scanButton:{
      backgroundColor: '#66BB6A',
      width: 50,
      borderWidth: 1.5,
      borderLeftWidth: 0
    },
    submitButton:{
      backgroundColor: '#FBC02D', 
      width: 100, 
      height:50 
    }, 
      submitButtonText:{ 
        padding: 10, 
        textAlign: 'center', 
        fontSize: 20, 
        fontWeight:"bold", 
        color: 'white' 
    },
    
  });