import React, { useState, useEffect } from 'react';
import {
  Box,
  Stack,
  IconButton,
} from '@mui/material';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import DoneIcon from '@mui/icons-material/Done';
import CloseIcon from '@mui/icons-material/Close';
import parse from 'html-react-parser';
import DOMPurify from 'dompurify';

const DescriptionBox = ({ initialDescription, onSave, name = "description", forceEdit = false }) => {
  const [isEditing, setIsEditing] = useState(forceEdit);
  const [description, setDescription] = useState(initialDescription);
  const [originalDescription, setOriginalDescription] = useState(initialDescription);

  useEffect(() => {
    setDescription(initialDescription);
  }, [initialDescription]);

  useEffect(() => {
    if (forceEdit) {
      setIsEditing(true);
    }
  }, [forceEdit]);

  const handleStartEditing = () => {
    if (forceEdit) return; // Already editing if forced
    setOriginalDescription(description);
    setIsEditing(true);
  };

  const handleSave = () => {
    // Send standard event object for handleInputChange compatibility
    onSave({ target: { name, value: description } });
    if (!forceEdit) {
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setDescription(originalDescription);
    if (!forceEdit) {
      setIsEditing(false);
    }
  };

  const handleChange = (content) => {
    setDescription(content);
    // Optionally call onSave on every change if we want live updates in global edit mode
    if (forceEdit) {
        onSave({ target: { name, value: content } });
    }
  };

  return (
    <Box sx={{ position: 'relative', width: '100%' }}>
      {isEditing ? (
        <Box sx={{ backgroundColor: '#fff', borderRadius: '4px' }}>
          <ReactQuill
            theme="snow"
            value={description}
            onChange={handleChange}
            modules={{
              toolbar: [
                [{ header: [1, 2, false] }],
                ['bold', 'italic', 'underline', 'strike'],
                [{ list: 'ordered' }, { list: 'bullet' }],
                ['clean'],
              ],
            }}
            placeholder="Describe the task details here..."
          />
          {!forceEdit && (
            <Stack direction="row" spacing={1} sx={{ mt: 1, justifyContent: 'flex-end' }}>
              <IconButton size="small" onClick={handleSave} color="primary">
                <DoneIcon />
              </IconButton>
              <IconButton size="small" onClick={handleCancel} color="error">
                <CloseIcon />
              </IconButton>
            </Stack>
          )}
        </Box>
      ) : (
        <Box
          sx={{
            padding: '8px 12px',
            borderRadius: '4px',
            border: '1px solid transparent',
            transition: 'all 0.2s ease',
            backgroundColor: 'transparent',
            '&:hover': {
              backgroundColor: 'rgba(9, 30, 66, 0.05)',
              borderColor: 'rgba(9, 30, 66, 0.13)',
              cursor: 'pointer',
            },
          }}
          onClick={handleStartEditing}
        >
          {description ? (
            <div className="ql-editor" style={{ padding: 0, minHeight: 'unset' }}>
              {parse(DOMPurify.sanitize(description), {
                replace: (node) => node
              })}
            </div>
          ) : (
            <Box sx={{ color: '#5e6c84' }}>
              Add a description...
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
};

export default DescriptionBox;