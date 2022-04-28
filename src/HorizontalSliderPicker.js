
import React, {
  useEffect, 
  useState,
  useRef,
  useCallback
} from 'react';
import {
  ScrollView,
  View,
  TouchableOpacity,
  ViewPropTypes,
} from 'react-native';
import PropTypes from 'prop-types';



const Edgers = ({ width }) => {
  if (width === null) {
    return null
  }
  else {
    return <View style={{ width }} />
  }
}
Edgers.defaultProps = {
  width: null
}
Edgers.propTypes = {
  width: PropTypes.number.isRequired
};

const HorizontalSliderPicker = ({ data, renderItem, onSelectedIndex, initialIndex, ...rest }) => {

  const [itemCoords, setitemCoords] = useState(null)
  const [center, setCenter] = useState(null)
  const [initialScroll, setInitialScroll] = useState(false);
  const [onScrollNativeEvent, setOnScrollNativeEvent] = useState(null)
  const [onLayoutScrollView, setOnLayoutScrollView] = useState(null)
  const [edgersWidth, setEdgersWidth] = useState(null)
  const scrollRef = useRef(null);
  const scrollEventThrottle = 20
  const decelerationRate = 0.1999
  const defaultSpaceBetweenItems = { paddingHorizontal: 6 }
  const _itemCoords = []
  
  const validateItemLayout = (layout) => {
    if(layout && Array.isArray(layout) && layout[0].height && layout[0].width){
      return true
    }
    return false
  }


  useEffect(() => {
    memoizedCallback()  
  },[initialIndex, itemCoords, onLayoutScrollView])
  

  useEffect(() => {
    // don't need to scrollToPosition on 0
    if (initialIndex > 0 && itemCoords && onLayoutScrollView?.width) onPressItem(initialIndex)
    if (!initialScroll) setInitialScroll(true)
  },[initialIndex, itemCoords, onLayoutScrollView])
  


  const memoizedCallback = useCallback(() => {
    if(validateItemLayout(itemCoords) && onLayoutScrollView){
      adjustEdgers()
    }
  })

  const adjustEdgers = () => {
    const { width } = onLayoutScrollView
      const adjustFirstItem = itemCoords[0].width / 2
      setEdgersWidth(((width / 2) - adjustFirstItem))
  }

  const onScroll = (e) => {
    const { nativeEvent } = e
    const { contentOffset } = nativeEvent
    const { layoutMeasurement } = nativeEvent
    const center = (layoutMeasurement.width / 2) + (contentOffset.x)
    setOnScrollNativeEvent(nativeEvent)
    setCenter(center)
  }

  const scrollToPosition = (x) => {
    try {
      scrollRef.current.scrollTo({ x, animated: true })
    } catch (error) {
      scrollToPosition(x)
    }
  }

  const onLayout = (e) => {
    setOnLayoutScrollView(e.nativeEvent.layout)
  }

  const onPressItem = (index) => {
    const closetValue = itemCoords[index]
    var x = null
    if (onScrollNativeEvent) {
      const { contentOffset } = onScrollNativeEvent
      x = (contentOffset.x + (closetValue.x - center) + closetValue.width / 2)
    }
    else {
      const { width } = onLayoutScrollView
      x = (closetValue.x - (width / 2)) + closetValue.width / 2
    }
    setTimeout(() => {
      scrollToPosition(x)
      onSelectedIndex(index)
    }, 500)
  } 
 
  const itemOnLayout = (e, index) => {
    _itemCoords[index] = e.nativeEvent.layout
    if(data.length === _itemCoords.length) {
      setitemCoords(_itemCoords)
    }
  }

  const items = data.map((item, index) => (
    <TouchableOpacity
      key={index}
      onPress={() => onPressItem(index)}
      onLayout={(e) => itemOnLayout(e, index)}
      style={defaultSpaceBetweenItems}
    >
      {renderItem(item, index)}
    </TouchableOpacity>))


  return (
      <ScrollView
        ref={scrollRef}
        scrollEventThrottle={scrollEventThrottle}
        onLayout={onLayout}
        onScroll={onScroll}
        decelerationRate={decelerationRate}
        horizontal
        bounces={false}
        {...rest}
      >
        <Edgers width={edgersWidth} />
        {items}
        <Edgers width={edgersWidth} />
      </ScrollView>
  );
};

Edgers.propTypes = {
  data: PropTypes.array.isRequired,
  renderItem: PropTypes.func.isRequired,
  initialIndex: PropTypes.number,
  onSelectedIndex: PropTypes.func.isRequired,
};

Edgers.defaultProps = {
  initialIndex: 0,
};

export default HorizontalSliderPicker;
