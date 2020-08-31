import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Animated,
  Easing,
  Text,
  Image,
  AppState,
  Alert,
  Platform,
  Dimensions
} from 'react-native';
import PropTypes from 'prop-types';
import { RNCamera } from 'react-native-camera';

const defaultRectStyle = { height: 300, width: 300, borderWidth: 0, borderColor: '#000000', marginBottom: 0 };
const defaultCornerStyle = { height: 32, width: 32, borderWidth: 2, borderColor: '#35CDFA' };
const defaultScanBarStyle = { marginHorizontal: 4, borderWidth: 1, borderRadius: 2, backgroundColor: '#35CDFA' };
const defaultHintTextStyle = { color: '#fff', fontSize: 14, backgroundColor: 'transparent', marginTop: 32, paddingLeft: 60, paddingRight: 60, textAlign: 'center' };


export class QRScannerRectView extends Component {
  
  static propTypes = {
    maskColor: PropTypes.string,
    rectStyle: PropTypes.object,
    
    cornerStyle: PropTypes.object,
    cornerOffsetSize: PropTypes.number,
    isShowCorner: PropTypes.bool,
    
    isShowScanBar: PropTypes.bool,
    scanBarAnimateTime: PropTypes.number,
    scanBarAnimateReverse: PropTypes.bool,
    scanBarImage: PropTypes.any,
    scanBarStyle: PropTypes.object,
    
    hintText: PropTypes.string,
    hintTextStyle: PropTypes.object,

    qrCode: PropTypes.string,
  };
  
  static defaultProps = {
    maskColor: '#0000004D',
    cornerOffsetSize: 0,
    isShowScanBar: true,
    isShowCorner: true,
    scanBarAnimateTime: 3000,
    hintText: 'Automatically scan the QR code/bar code in the box',
    qrCode: '',
  };
  
  state = {
    animatedValue: new Animated.Value(0),
  };
  
  constructor(props){
    super(props);
    this.innerRectStyle = Object.assign(defaultRectStyle, props.rectStyle);
    this.innerCornerStyle = Object.assign(defaultCornerStyle, props.cornerStyle);
    this.innerScanBarStyle = Object.assign(defaultScanBarStyle, props.scanBarStyle);
    this.innerHintTextStyle = Object.assign(defaultHintTextStyle, props.hintTextStyle);
  }
  
  componentDidMount(){
    this.scanBarMove();
  }
  
  componentWillUnmount(){
    this.scanBarAnimation && this.scanBarAnimation.stop();
  }
  
  scanBarMove(){
    const { cornerOffsetSize, scanBarAnimateReverse, isShowScanBar } = this.props;
    const scanBarHeight = isShowScanBar ? this.innerScanBarStyle.height || 4 : 0;
    const startValue = this.innerCornerStyle.borderWidth;
    const endValue = this.innerRectStyle.height - (this.innerRectStyle.borderWidth + cornerOffsetSize + this.innerCornerStyle.borderWidth) - scanBarHeight;
    if ( scanBarAnimateReverse ) {
      this.scanBarAnimation = Animated.sequence([
        Animated.timing(this.state.animatedValue, {
          toValue: endValue,
          duration: this.props.scanBarAnimateTime,
          easing: Easing.linear,
          isInteraction: false,
          useNativeDriver: true,
        }),
        Animated.timing(this.state.animatedValue, {
          toValue: startValue,
          duration: this.props.scanBarAnimateTime,
          easing: Easing.linear,
          isInteraction: false,
          useNativeDriver: true,
        }),
      ]).start(() => this.scanBarMove());
    } else {
      this.state.animatedValue.setValue(startValue);
      this.scanBarAnimation = Animated.timing(this.state.animatedValue, {
        toValue: endValue,
        duration: this.props.scanBarAnimateTime,
        easing: Easing.linear,
        isInteraction: false,
        useNativeDriver: true,
      }).start(() => this.scanBarMove());
    }
  }
  
  getBackgroundColor = () => {
    return { backgroundColor: this.props.maskColor };
  };
  
  getRectSize = () => {
    return { height: this.innerRectStyle.height, width: this.innerRectStyle.width };
  };
  
  getRectOffsetHeight = () => {
    return { height: this.innerRectStyle.marginBottom };
  };
  
  getBorderStyle(){
    const { cornerOffsetSize } = this.props;
    return {
      height: this.innerRectStyle.height - cornerOffsetSize * 2,
      width: this.innerRectStyle.width - cornerOffsetSize * 2,
      borderWidth: this.innerRectStyle.borderWidth,
      borderColor: this.innerRectStyle.borderColor,
    };
  }
  
  getCornerStyle(){
    return {
      height: this.innerCornerStyle.height,
      width: this.innerCornerStyle.width,
      borderColor: this.innerCornerStyle.borderColor,
    };
  }
  
  getScanImageWidth(){
    return this.innerRectStyle.width - this.innerScanBarStyle.marginHorizontal * 2;
  }
  
  measureScanBarImage = (e) => {
    this.setState({ scanBarImageHeight: Math.round(e.layout.height) });
  };
  
  renderScanBar(){
    const { isShowScanBar, scanBarImage } = this.props;
    
    if ( !isShowScanBar ) return;
    return scanBarImage
      ? <Image source={ scanBarImage }
               style={ [
                 this.innerScanBarStyle,
                 {
                   resizeMode: 'contain',
                   backgroundColor: 'transparent',
                   width: this.getScanImageWidth(),
                 },
               ] }/>
      : <View style={ [ { height: 4 }, this.innerScanBarStyle ] }/>;
  }
  
  render(){
    const animatedStyle = {
      transform: [ { translateY: this.state.animatedValue } ],
    };
    
    const { borderWidth } = this.innerCornerStyle;
    const { isShowCorner, qrCode } = this.props;
    
    return (
      <View style={ [ styles.container, { bottom: 0 } ] }>
        
        <View style={ [ this.getBackgroundColor(), { flex: 1 } ] }/>
        
        <View style={ { flexDirection: 'row' } }>
          
          <View style={ [ this.getBackgroundColor(), { flex: 1 } ] }/>
          
          <View style={ [ styles.viewfinder, this.getRectSize() ] }>
            
            <View style={ this.getBorderStyle() }>
              <Animated.View style={ [ animatedStyle ] }>
                { this.renderScanBar() }
              </Animated.View>
            </View>
{/* 
            { qrCode && <View style={styles.qrCodeView}>
                <Text style={styles.qrCodeText}>{qrCode}</Text>
              </View>
            } */}
            
            { isShowCorner && <View style={ [
              this.getCornerStyle(),
              styles.topLeftCorner,
              { borderLeftWidth: borderWidth, borderTopWidth: borderWidth },
            ] }/> }
            
            { isShowCorner && <View style={ [
              this.getCornerStyle(),
              styles.topRightCorner,
              { borderRightWidth: borderWidth, borderTopWidth: borderWidth },
            ] }/> }
            
            { isShowCorner && <View style={ [
              this.getCornerStyle(),
              styles.bottomLeftCorner,
              { borderLeftWidth: borderWidth, borderBottomWidth: borderWidth },
            ] }/> }
            
            { isShowCorner && <View style={ [
              this.getCornerStyle(),
              styles.bottomRightCorner,
              { borderRightWidth: borderWidth, borderBottomWidth: borderWidth },
            ] }/> }
          </View>
          
          <View style={ [ this.getBackgroundColor(), { flex: 1 } ] }/>
        
        </View>
        
        <View style={ [ this.getBackgroundColor(), { flex: 1, alignItems: 'center' } ] }>
          <Text style={ this.innerHintTextStyle }>{ this.props.hintText }</Text>
        </View>
        
        <View style={ [ this.getBackgroundColor(), this.getRectOffsetHeight() ] }/>
      
      </View>
    );
  }
}

export default class QRScannerView extends Component {
  
  static propTypes = {
    
    maskColor: PropTypes.string,
    rectStyle: PropTypes.object,
    
    cornerStyle: PropTypes.object,
    cornerOffsetSize: PropTypes.number,
    isShowCorner: PropTypes.bool,
    
    isShowScanBar: PropTypes.bool,
    scanBarAnimateTime: PropTypes.number,
    scanBarAnimateReverse: PropTypes.bool,
    scanBarImage: PropTypes.any,
    scanBarStyle: PropTypes.object,
    
    hintText: PropTypes.string,
    hintTextStyle: PropTypes.object,
    
    renderHeaderView: PropTypes.func,
    renderFooterView: PropTypes.func,
    
    onScanResult: PropTypes.func,
    scanInterval: PropTypes.number,
    torchOn: PropTypes.bool,
    userFront: PropTypes.bool,
  };
  
  static defaultProps = {
    torchOn: false,
    scanInterval: 2000,
    userFront: false
  };
  
  state = {
    qrCode: '',
    scanEnabled: true,

    flash: 'off',
    zoom: 0,
    autoFocus: 'on',
    autoFocusPoint: {
      normalized: { x: 0.5, y: 0.5 }, // normalized values required for autoFocusPointOfInterest
      drawRectPosition: {
        x: Dimensions.get('window').width * 0.5 - 32,
        y: Dimensions.get('window').height * 0.5 - 32,
      },
    },
    depth: 0,
    type: 'back',
    whiteBalance: 'auto',
    ratio: '16:9',
    recordOptions: {
      mute: false,
      maxDuration: 5,
      quality: RNCamera.Constants.VideoQuality['288p'],
    },
    isRecording: false,
    canDetectFaces: false,
    canDetectText: false,
    canDetectBarcode: false,
    faces: [],
    textBlocks: [],
    barcodes: [],
  };

  rnCamera = null;

  constructor(props){
    super(props);
    this.onScanResult = throttle(
      this.onScanResult,
      this.props.scanInterval,
      { maxWait: 0, trailing: false }
    );
  }
  
  componentDidMount(){
    AppState.addEventListener('change', this.handleAppStateChange);
  }
  
  componentWillUnmount(){
    this.stopScanCamera();
  }

  stopScanCamera = () => {
    this.setState({ scanEnabled: false })
    AppState.removeEventListener('change', this.handleAppStateChange);
    this.rnCamera && this.rnCamera.pausePreview && this.rnCamera.pausePreview();
  }
  
  handleAppStateChange = (currentAppState) => {
    if ( currentAppState !== 'active' ) {
      this.rnCamera && this.rnCamera.pausePreview && this.rnCamera.pausePreview();
    } else {
      this.rnCamera && this.rnCamera.pausePreview && this.rnCamera.resumePreview();
    }
  };
  
  onScanResult = (e) => {
    const _this = this;
    const { _t } = this.props.appActions;
    console.log('====== onScanResult: e: ', e);
    if (
      this.state.scanEnabled &&
      RNCamera.Constants.BarCodeType.qr === e.type
    ) {
      const qrCode = e ? `${e.type}: ${e.data}` : '';
      this.handleAppStateChange('stop');
      this.setState({scanEnabled: false, qrCode}, (that=this) => {
        Alert.alert(
          _t('QR Code scanned'),
          `${_t('Are you sure to rent a Nono power bank for 48 hours?')}`,
          [
            {
              text: 'Cancel',
              onPress: () => {
                that.resumeScan();
              },
              style: 'cancel',
            },
            {text: 'OK', onPress: () => {
              that.props.onScanResult(qrCode, that.resumeScan);
            }},
          ],
          {cancelable: false},
        );  
      })
    }
  }

  onPausePreview = () => {
    console.log('===== onPausePreview');
    this.handleAppStateChange('stop');
  }

  resumeScan = () => {
    console.log('==== resumeScan');
    this.handleAppStateChange('active');
    this.setState({scanEnabled: true});
  }
  
  render(){
    const { renderHeaderView, renderFooterView, torchOn, userFront, appActions } = this.props;
    const { _t } = appActions;
    const { FlashMode } = RNCamera.Constants;
    return (
      <RNCamera
        ref={ ref => this.rnCamera = ref }
        captureAudio={ false }
        onBarCodeRead={ this.onScanResult }
        pausePreview={ this.onPausePreview }
        type={ userFront ? RNCamera.Constants.Type.front : RNCamera.Constants.Type.back }
        flashMode={torchOn ? (FlashMode.on) : FlashMode.off }
        autoFocus={this.state.autoFocus}
        style={{ flex: 1, justifyContent: 'space-between', } }
        aspect={1}

        barCodeTypes={[RNCamera.Constants.BarCodeType.qr, 'qr']}
        
        // permissionDialogTitle={'Permission to use camera'}
        // permissionDialogMessage={'We need your permission to use your camera phone'}

        // onGoogleVisionBarcodesDetected={({ barcodes }) => {
        //   console.log('===== onGoogleVisionBarcodesDetected: barcodes: ', barcodes)
        //   this.onScanResult(barcodes[0]);
        // }}
      >
        
        <QRScannerRectView
          maskColor={ this.props.maskColor }
          rectStyle={ this.props.rectStyle }
          isShowCorner={ this.props.isShowCorner }
          cornerStyle={ this.props.cornerStyle }
          cornerOffsetSize={ this.props.cornerOffsetSize }
          isShowScanBar={ this.props.isShowScanBar }
          scanBarAnimateTime={ this.props.scanBarAnimateTime }
          scanBarAnimateReverse={ this.props.scanBarAnimateReverse }
          scanBarImage={ this.props.scanBarImage }
          scanBarStyle={ this.props.scanBarStyle }
          hintText={ this.props.hintText }
          hintTextStyle={ this.props.hintTextStyle }
          qrCode={this.state.qrCode}
        />
        
        { renderHeaderView && <View style={ [ styles.topContainer ] }>{ renderHeaderView() }</View> }
        
        { renderFooterView && <View style={ [ styles.bottomContainer ] }>{ renderFooterView(this.stopScanCamera) }</View> }
      
      </RNCamera>
    );
  }
}

const styles = StyleSheet.create({
  topContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  container: {
    flex: 1,
  },
  viewfinder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  qrCodeView: {
    position: 'absolute',
    bottom: 0,
    left: 0,
  },
  qrCodeText: {
    color: '#fff'
  },
  topLeftCorner: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  topRightCorner: {
    position: 'absolute',
    top: 0,
    right: 0,
  },
  bottomLeftCorner: {
    position: 'absolute',
    bottom: 0,
    left: 0,
  },
  bottomRightCorner: {
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
});

// Copy from lodash 
function throttle(func, wait, options){
  let leading = true;
  let trailing = true;
  
  if ( typeof func !== 'function' ) {
    throw new TypeError('Expected a function');
  }
  if ( isObject(options) ) {
    leading = 'leading' in options ? !!options.leading : leading;
    trailing = 'trailing' in options ? !!options.trailing : trailing;
  }
  return debounce(func, wait, {
    leading,
    trailing,
    'maxWait': wait,
  });
}

// Copy from lodash 
function debounce(func, wait, options){
  let lastArgs,
    lastThis,
    maxWait,
    result,
    timerId,
    lastCallTime;
  
  let lastInvokeTime = 0;
  let leading = false;
  let maxing = false;
  let trailing = true;
  
  // Bypass `requestAnimationFrame` by explicitly setting `wait=0`.
  const useRAF = (!wait && wait !== 0 && typeof root.requestAnimationFrame === 'function');
  
  if ( typeof func !== 'function' ) {
    throw new TypeError('Expected a function');
  }
  wait = +wait || 0;
  if ( isObject(options) ) {
    leading = !!options.leading;
    maxing = 'maxWait' in options;
    maxWait = maxing ? Math.max(+options.maxWait || 0, wait) : maxWait;
    trailing = 'trailing' in options ? !!options.trailing : trailing;
  }
  
  function invokeFunc(time){
    const args = lastArgs;
    const thisArg = lastThis;
    
    lastArgs = lastThis = undefined;
    lastInvokeTime = time;
    result = func.apply(thisArg, args);
    return result;
  }
  
  function startTimer(pendingFunc, wait){
    if ( useRAF ) {
      root.cancelAnimationFrame(timerId);
      return root.requestAnimationFrame(pendingFunc);
    }
    return setTimeout(pendingFunc, wait);
  }
  
  function cancelTimer(id){
    if ( useRAF ) {
      return root.cancelAnimationFrame(id);
    }
    clearTimeout(id);
  }
  
  function leadingEdge(time){
    // Reset any `maxWait` timer.
    lastInvokeTime = time;
    // Start the timer for the trailing edge.
    timerId = startTimer(timerExpired, wait);
    // Invoke the leading edge.
    return leading ? invokeFunc(time) : result;
  }
  
  function remainingWait(time){
    const timeSinceLastCall = time - lastCallTime;
    const timeSinceLastInvoke = time - lastInvokeTime;
    const timeWaiting = wait - timeSinceLastCall;
    
    return maxing
      ? Math.min(timeWaiting, maxWait - timeSinceLastInvoke)
      : timeWaiting;
  }
  
  function shouldInvoke(time){
    const timeSinceLastCall = time - lastCallTime;
    const timeSinceLastInvoke = time - lastInvokeTime;
    
    // Either this is the first call, activity has stopped and we're at the
    // trailing edge, the system time has gone backwards and we're treating
    // it as the trailing edge, or we've hit the `maxWait` limit.
    return (lastCallTime === undefined || (timeSinceLastCall >= wait) ||
      (timeSinceLastCall < 0) || (maxing && timeSinceLastInvoke >= maxWait));
  }
  
  function timerExpired(){
    const time = Date.now();
    if ( shouldInvoke(time) ) {
      return trailingEdge(time);
    }
    // Restart the timer.
    timerId = startTimer(timerExpired, remainingWait(time));
  }
  
  function trailingEdge(time){
    timerId = undefined;
    
    // Only invoke if we have `lastArgs` which means `func` has been
    // debounced at least once.
    if ( trailing && lastArgs ) {
      return invokeFunc(time);
    }
    lastArgs = lastThis = undefined;
    return result;
  }
  
  function cancel(){
    if ( timerId !== undefined ) {
      cancelTimer(timerId);
    }
    lastInvokeTime = 0;
    lastArgs = lastCallTime = lastThis = timerId = undefined;
  }
  
  function flush(){
    return timerId === undefined ? result : trailingEdge(Date.now());
  }
  
  function pending(){
    return timerId !== undefined;
  }
  
  function debounced(...args){
    const time = Date.now();
    const isInvoking = shouldInvoke(time);
    
    lastArgs = args;
    lastThis = this;
    lastCallTime = time;
    
    if ( isInvoking ) {
      if ( timerId === undefined ) {
        return leadingEdge(lastCallTime);
      }
      if ( maxing ) {
        // Handle invocations in a tight loop.
        timerId = startTimer(timerExpired, wait);
        return invokeFunc(lastCallTime);
      }
    }
    if ( timerId === undefined ) {
      timerId = startTimer(timerExpired, wait);
    }
    return result;
  }
  
  debounced.cancel = cancel;
  debounced.flush = flush;
  debounced.pending = pending;
  return debounced;
}

// Copy from lodash 
function isObject(value){
  const type = typeof value;
  return value != null && (type === 'object' || type === 'function');
}