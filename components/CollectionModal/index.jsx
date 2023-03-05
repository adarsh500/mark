import { Button, Input, Modal, Text } from '@nextui-org/react';
import { useState } from 'react';

const CollectionModal = (props) => {
  const { visible, setVisible, email, parent, setParent, refetchCollections } =
    props;
  const [name, setName] = useState('');

  const closeHandler = () => {
    setVisible(false);
  };

  const createCollection = async () => {
    const res = await fetch(`api/collections`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        collection: name,
        parent,
      }),
    });
    setParent('');
    setName('');
    refetchCollections();
    closeHandler();
  };

  return (
    <Modal
      closeButton
      aria-labelledby="modal-title"
      open={visible}
      onClose={closeHandler}
    >
      <Modal.Header>
        <Text id="modal-title" size={18}>
          Create a collection
        </Text>
      </Modal.Header>
      <Modal.Body>
        <Input
          label="Enter Collection Name"
          clearable="true"
          bordered
          fullWidth
          color="primary"
          size="lg"
          placeholder="Tech blogs"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </Modal.Body>
      <Modal.Footer>
        <Button auto flat color="error" onClick={closeHandler}>
          Cancel
        </Button>
        <Button auto flat onClick={createCollection}>
          Create
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CollectionModal;
