
import React, {
  useEffect, useState,
} from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList
} from 'react-native';
import { HorizontalSliderPicker } from 'center-slider-horizontal-picker'




const App = () => {

  const [data, setData] = useState([])
  const [selectIndex, setselectIndex] = useState(null)

  const fetchData = async () => {
    const res = await fetch('https://randomuser.me/api/?results=50')
    const data = await res.json()
    setData(data.results)
  }

  useEffect(() => {
    fetchData()
  }, [])


  return (
    <View
    style={styles.Container}
    >
      <View
      style={styles.ChildContainer}
      >
        <HorizontalSliderPicker
          data={data}
          alwaysBounceHorizontal={false}
          onSelectedIndex={(index) => setselectIndex(index)}
          renderItem={(item, index) =>
            <View
              key={index}
              style={{
                paddingHorizontal: 20,
                paddingVertical: 20,
                backgroundColor: index === selectIndex ? 'white' : 'black',
                borderRadius: 20,
              }}>
              <Text 
                style={{ 
                  color: index === selectIndex ? 'black' : 'white' 
                }}>
                {item.name.first}
              </Text>
            </View>
          }/>
      </View>
  </View>
  )
}

const styles = StyleSheet.create({
  ChildContainer: {  
    width: '100%', 
    marginVertical: 120,
    justifyContent: 'center', 
    alignItems: 'center'  
   },
  Container: {  
    width: '100%', 
    flex: 1, 
    backgroundColor:'grey', 
    justifyContent: 'center', 
    alignItems: 'center' 
  }
});

export default App;