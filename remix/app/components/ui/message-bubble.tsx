const styles = {
  rightArrow: {
    position: 'absolute',
    backgroundColor: '#0078fe',
    //backgroundColor:"red",
    width: 20,
    height: 25,
    bottom: 0,
    borderBottomLeftRadius: 25,
    right: -10,
  },

  rightArrowOverlap: {
    position: 'absolute',
    backgroundColor: '#fff',
    //backgroundColor:"green",
    width: 20,
    height: 35,
    bottom: -6,
    borderBottomLeftRadius: 18,
    right: -20,
  },

  /*Arrow head for recevied messages*/
  leftArrow: {
    position: 'absolute',
    backgroundColor: '#dedede',
    //backgroundColor:"red",
    width: 20,
    height: 18,
    bottom: 0,
    borderBottomRightRadius: 25,
    left: -10,
  },

  leftArrowOverlap: {
    position: 'absolute',
    backgroundColor: '#fff',
    width: 20,
    height: 26,
    bottom: -6,
    borderTopLeftRadius: '20px',
    borderBottomRightRadius: 18,
    left: -20,
  },
};

type MessageProps = {
  index: number;
  text?: string;
  children?: React.ReactNode;
};

export function SentMessage(props: MessageProps) {
  return (
    <div
      style={{
        backgroundColor: '#0078fe',
        padding: 10,
        paddingLeft: 15,
        paddingRight: 15,
        marginLeft: 'auto',
        marginTop: 5,
        width: 'fit-content',
        maxWidth: '70%',
        alignSelf: 'flex-end',
        position: 'relative',
        borderRadius: 20,
      }}
    >
      <p
        className='whitespace-pre-wrap'
        style={{ fontSize: 16, color: '#fff' }}
      >
        {props.text}
      </p>

      <div style={styles.rightArrow as any}></div>

      <div style={styles.rightArrowOverlap as any}></div>
    </div>
  );
}

export function ReceivedMessage(props: MessageProps) {
  return (
    <div
      style={{
        backgroundColor: '#dedede',
        padding: 10,
        marginTop: 5,
        paddingLeft: 15,
        paddingRight: 15,
        marginRight: 'auto',
        marginLeft: '1%',
        width: 'fit-content',
        maxWidth: '70%',
        alignSelf: 'flex-start',
        position: 'relative',
        borderRadius: 20,
      }}
    >
      {props.text ? (
        <p
          className='whitespace-pre-wrap'
          style={{ fontSize: 16, color: '#000', justifyContent: 'center' }}
        >
          {props.text}
        </p>
      ) : (
        props.children
      )}
      <div style={styles.leftArrow as any}></div>
      <div style={styles.leftArrowOverlap as any}></div>
    </div>
  );
}
