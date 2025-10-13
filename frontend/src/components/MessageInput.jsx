import { useRef, useState } from "react";
import useKeyboardSound from "../hooks/useKeyboardSound";
import { useChatStore } from "../store/useChatStore";
import toast from "react-hot-toast";
import { ImageIcon, SendIcon, XIcon } from "lucide-react";

function MessageInput() {
  const { playRandomKeyStrokeSound } = useKeyboardSound();
  const [text, setText] = useState(""); // message text state
  const [imagePreview, setImagePreview] = useState(null); // image preview state
  const fileInputRef = useRef(null); // ref for file input element to take images from user

  const { sendMessage, isSoundEnabled } = useChatStore();
  
  // handle sending message
  // so this is for sending text messages and image messages
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim() && !imagePreview) return; // don't send empty messages
    if (isSoundEnabled) playRandomKeyStrokeSound(); // play sound on message send

    const formData = new FormData();
    if (text.trim()) formData.append("text", text.trim());

    // If you have imagePreview (Base64), convert it to Blob
    if (imagePreview) {
      const response = await fetch(imagePreview);
      const blob = await response.blob();
      const file = new File([blob], "image.jpg", { type: blob.type });
      formData.append("images", file);
    }

    await sendMessage(formData); // ✅ send FormData, not JSON

    setText("");
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = ""; // reset file input value
  };

  // this is for handlinfg image selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className='p-4 border-t border-slate-700/50'>
      {imagePreview && (
        <div className='max-w-3xl mx-auto mb-3 flex items-center'>
          <div className='relative'>
            <img
              src={imagePreview}
              alt='Preview'
              className='w-20 h-20 object-cover rounded-lg border border-slate-700'
            />
            <button
              onClick={removeImage}
              className='absolute -top-2 -right-2 w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-slate-200 hover:bg-slate-700'
              type='button'
            >
              <XIcon className='w-4 h-4' />
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSendMessage} className='max-w-3xl mx-auto flex space-x-4'>
        <input
          type='text'
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            isSoundEnabled && playRandomKeyStrokeSound();
          }}
          className='flex-1 bg-slate-800/50 border border-slate-700/50 rounded-lg py-2 px-4'
          placeholder='Type your message...'
        />

        <input
          type='file'
          accept='image/*'
          ref={fileInputRef}
          onChange={handleImageChange}
          className='hidden'
        />

        <button
          type='button'
          onClick={() => fileInputRef.current?.click()}
          className={`bg-slate-800/50 text-slate-400 hover:text-slate-200 rounded-lg px-4 transition-colors ${
            imagePreview ? "text-cyan-500" : ""
          }`}
        >
          <ImageIcon className='w-5 h-5' />
        </button>
        <button
          type='submit'
          disabled={!text.trim() && !imagePreview}
          className='bg-gradient-to-r from-cyan-500 to-cyan-600 text-white rounded-lg px-4 py-2 font-medium hover:from-cyan-600 hover:to-cyan-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed'
        >
          <SendIcon className='w-5 h-5' />
        </button>
      </form>
    </div>
  );
}

export default MessageInput;
