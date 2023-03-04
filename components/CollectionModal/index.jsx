import { Badge, Button, Input, Modal, Text } from '@nextui-org/react';
import { useState } from 'react';
import { HiXMark } from 'react-icons/hi2';
import styles from './CollectionModal.module.scss';

const CollectionModal = (props) => {
  const { visible, setVisible, collections, email } = props;
  const [collection, setCollection] = useState('');
  const [link, setLink] = useState('');
  const [isKeyReleased, setIsKeyReleased] = useState(false);
  const [input, setInput] = useState('');
  const [tags, setTags] = useState([]);

  const onChange = (e) => {
    const { value } = e.target;
    setInput(value);
  };

  const closeHandler = () => {
    setVisible(false);
  };

  const onKeyDown = (e) => {
    const { key } = e;
    const trimmedInput = input.trim();

    if (key === ',' && trimmedInput.length && !tags.includes(trimmedInput)) {
      e.preventDefault();
      setTags((prevState) => [...prevState, trimmedInput]);
      setInput('');
    }

    if (key === 'Backspace' && !input.length && tags.length && isKeyReleased) {
      const tagsCopy = [...tags];
      const poppedTag = tagsCopy.pop();
      e.preventDefault();
      setTags(tagsCopy);
      setInput(poppedTag);
    }

    setIsKeyReleased(false);
  };

  const deleteTag = (index) => {
    setTags((prevState) => prevState.filter((tag, i) => i !== index));
  };

  const onKeyUp = () => {
    setIsKeyReleased(true);
  };

  const createBookmark = async () => {
    const res = await fetch(`api/bookmarks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        collection: collection,
        tags: tags,
        url: `https://${link}`,
        favourite: false,
      }),
    });
    closeHandler();
  };

  const handleLink = (e) => {
    setLink(e.target.value);
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
          Create a bookmark
        </Text>
      </Modal.Header>
      <Modal.Body>
        <Input
          label="Enter URL"
          clearable="true"
          bordered
          fullWidth
          color="primary"
          size="lg"
          labelLeft="https://"
          placeholder="github.com/adarsh500"
          value={link}
          onChange={handleLink}
        />

        <Text>Select collection</Text>
        <select
          className={styles.select}
          value={collection}
          onChange={(e) => setCollection(e.target.value)}
        >
          {collections?.map((collection) => (
            <option key={collection._id} value={collection.name}>
              {collection.collection}
            </option>
          ))}
        </select>

        <div className={styles.tags}>
          {tags?.map((tag, index) => (
            <Badge
              isSquared
              className={styles.badge}
              color="warning"
              variant="flat"
              key={index}
              disableOutline
              onClick={() => deleteTag(index)}
            >
              # {tag}
              <HiXMark className={styles.icon} />
            </Badge>
          ))}
        </div>
        <Input
          clearable="true"
          bordered
          label="Add Tags"
          color="primary"
          placeholder="comma seperated tags"
          onKeyDown={onKeyDown}
          onChange={onChange}
          onKeyUp={onKeyUp}
          value={input}
        />
      </Modal.Body>
      <Modal.Footer>
        <Button auto flat color="error" onClick={closeHandler}>
          Cancel
        </Button>
        <Button auto onClick={createBookmark}>
          Create
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CollectionModal;
