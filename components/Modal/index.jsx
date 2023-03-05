import ParentPreview from '@components/ParentPreview';
import { Badge, Button, Input, Modal, Text } from '@nextui-org/react';
import { useState } from 'react';
import { HiXMark } from 'react-icons/hi2';
import { toast } from 'sonner';
import styles from './Modal.module.scss';

const BookmarkModal = (props) => {
  const { visible, setVisible, collections, email } = props;
  const [link, setLink] = useState('');
  const [isKeyReleased, setIsKeyReleased] = useState(false);
  const [input, setInput] = useState('');
  const [tags, setTags] = useState([]);
  const [selectedCollection, setSelectedCollection] = useState('');

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
        collection: selectedCollection,
        tags: tags,
        url: link,
        favourite: false,
      }),
    });
    toast.success('Created bookmark successfully!');
    closeHandler();
    setSelectedCollection('');
    setTags([]);
    setLink('');
    setInput('');
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
          label="URL"
          clearable="true"
          bordered
          fullWidth
          color="primary"
          size="lg"
          placeholder="https://github.com"
          value={link}
          onChange={handleLink}
        />
        <Text color="primary" size="lg">
          Select collection
        </Text>

        <div className={styles.treeContainer}>
          <ParentPreview
            collection={collections}
            selectedCollection={selectedCollection}
            setSelectedCollection={setSelectedCollection}
          />
        </div>

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
          size="lg"
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

export default BookmarkModal;
