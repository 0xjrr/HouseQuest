import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity
} from 'react-native';
import { KudosOrSlobs, KSAction } from '../../../models';
import Colors from '../../../constants/Colors';
import { useKudosOrSlobsContext, useUserContext } from '../../../contexts';
import { Fonts, Spacers, Style } from '../../../constants';
import AddFeedbackModal from '../../../components/actions/kudos/AddFeedbackModal';

// TODO refactor, basically rewrite, extract components, fix styling

const Kudos: React.FC = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [kudosOrSlobs, setKudosOrSlobs] = useState<KudosOrSlobs[]>([]);
  const { state: stateKudosOrSlobs } = useKudosOrSlobsContext();
  const { state: stateUser } = useUserContext();

  useEffect(() => {
    setKudosOrSlobs([...stateKudosOrSlobs.kudosOrSlobs]);
  }, [stateKudosOrSlobs]);

  useEffect(() => {
    console.log('Kudos.tsx: Current state of kudosOrSlobs: \n', kudosOrSlobs);
  }, [kudosOrSlobs]);

  const renderMessage = (item: KudosOrSlobs) => {
    const borderColor =
      item.type === KSAction.KUDOS ? Colors.lightGreen : Colors.pink;
    const backgroundColor =
      item.type === KSAction.KUDOS ? Colors.lightGreen : Colors.pink;

    return (
      <View style={[styles.messageContainer, { borderColor, backgroundColor }]}>
        <View style={styles.avatars}>
          {/* <Avatar username={item.sender} />
                    <Avatar username={item.receiver} /> */}
        </View>
        <Text>{item.message}</Text>
        <Text>{item.points}</Text>
      </View>
    );
  };

  const renderItem = ({ item }: { item: KudosOrSlobs }) => {
    return (
      <View style={styles.item}>
        {renderMessage(item)}
        {item.points !== null && item.points !== undefined && (
          <Text style={styles.points}>Points: {String(item.points)}</Text>
        )}
        <Text>Sender: {item.sender}</Text>
        <Text>Receiver: {item.receiver}</Text>
        <Text>Timestamp: {item.timestamp.toISOString()}</Text>
      </View>
    );
  };

  useEffect(() => {
    console.log('Kudos.tsx: Current state of userContext: \n', stateUser);
  }, [stateUser]);

  useEffect(() => {
    console.log(
      'Kudos.tsx: Current state of kudosOrSlobsContext: \n',
      stateKudosOrSlobs
    );
  }, [stateKudosOrSlobs]);

  return (
    <View style={styles.container}>
      <FlatList
        data={kudosOrSlobs}
        renderItem={renderItem}
        keyExtractor={(_, index) => index.toString()}
      />
      <TouchableOpacity
        style={styles.button}
        onPress={() => setModalVisible(true)}>
        <Text style={styles.buttonText}>Give Feedback</Text>
      </TouchableOpacity>
      <AddFeedbackModal
        isModalVisible={modalVisible}
        setModalVisible={setModalVisible}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20
  },
  item: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10
  },

  messageContainer: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center'
  },
  avatars: {
    flexDirection: 'row',
    marginRight: 10
  },
  avatar: {
    backgroundColor: 'lightgray',
    width: 30,
    height: 30,
    borderRadius: 15,
    textAlign: 'center',
    lineHeight: 30,
    marginRight: 5
  },
  points: {
    marginTop: 5,
    fontWeight: 'bold'
  },
  button: {
    backgroundColor: Colors.darkGreen,
    margin: Spacers.medium,
    padding: Spacers.medium,
    alignItems: 'center',
    borderRadius: Style.radius
  },
  buttonText: {
    fontSize: Fonts.medium,
    fontWeight: 'bold',
    color: Colors.white
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  buttonClose: {
    backgroundColor: Colors.darkGreen,
    borderRadius: Style.radius,
    padding: Spacers.medium,
    elevation: 2,
    marginTop: 15
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center'
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center'
  }
});

export default Kudos;
