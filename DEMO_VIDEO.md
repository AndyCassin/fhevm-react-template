# Demo Video Instructions

## Creating the Demo Video

This document provides guidelines for creating the `demo.mp4` video that demonstrates the FHEVM SDK and example applications.

## Video Requirements

- **Duration**: 3-5 minutes
- **Format**: MP4 (H.264 codec recommended)
- **Resolution**: 1920x1080 (1080p) minimum
- **Frame Rate**: 30 fps minimum
- **Audio**: Clear voice narration with minimal background noise
- **File Size**: Under 100MB (use compression if needed)

## Content Outline

### 1. Introduction (30 seconds)

- **Title Screen**: "FHEVM SDK - Universal Confidential Frontend Framework"
- **Quick Overview**: Briefly introduce what FHEVM SDK does
- **Key Features**: Highlight 2-3 main features

### 2. SDK Overview (45 seconds)

- Show project structure
- Highlight key directories:
  - `packages/fhevm-sdk/` - The SDK package
  - `examples/` - Example applications
- Explain framework-agnostic nature
- Show wagmi-like API structure

### 3. Next.js Example Demo (90 seconds)

**Show these steps:**

1. **Installation and Setup**
   ```bash
   npm install
   npm run dev:nextjs
   ```

2. **Wallet Connection**
   - Click "Connect Wallet" button
   - Show MetaMask popup
   - Display connected address

3. **Encryption Demo**
   - Enter a number in the input field
   - Click "Encrypt with FHE"
   - Show encryption result
   - Highlight encrypted data information

4. **Code Walkthrough**
   - Show `app/page.tsx`
   - Highlight `useEncryptedInput` hook usage
   - Point out how simple the API is

### 4. Patent License Example Demo (90 seconds)

**Show these features:**

1. **Contract Deployment** (quick flash)
   ```bash
   cd examples/patent-license
   npm run deploy
   ```

2. **Patent Registration**
   - Fill out patent registration form
   - Show encryption of royalty rates
   - Submit transaction
   - Show success confirmation

3. **License Request**
   - Navigate to "Request License" tab
   - Fill in license details
   - Show confidential terms submission
   - Transaction confirmation

4. **Confidential Bidding**
   - Show bidding interface
   - Submit encrypted bid
   - Highlight bid privacy

### 5. SDK API Demonstration (30 seconds)

**Code snippets to show:**

```typescript
// Simple encryption
const { encrypt } = useEncryptedInput();
const encrypted = await encrypt(42, 'uint32');
```

```typescript
// Contract interaction
const contract = useFhevmContract({
  address: '0x...',
  abi: myABI,
  withSigner: true
});
```

```typescript
// Decryption
const { decrypt } = useDecrypt();
await decrypt(contractAddress, handle);
```

### 6. Key Features Highlight (30 seconds)

Show text/graphics highlighting:
- ✅ Framework-Agnostic Core
- ✅ React Hooks Available
- ✅ wagmi-like Developer Experience
- ✅ Complete FHE Workflow
- ✅ TypeScript Support
- ✅ Multiple Examples Included

### 7. Conclusion (30 seconds)

- **Quick Recap**: Summarize what was shown
- **Call to Action**:
  - Star the GitHub repository
  - Read the documentation
  - Try the examples
- **Contact Info**: GitHub link, documentation link
- **End Screen**: "Built with privacy in mind using FHE"

## Recording Tips

### Screen Recording Setup

**Recommended Tools:**
- **macOS**: QuickTime Player, ScreenFlow, or OBS Studio
- **Windows**: OBS Studio, Camtasia, or Bandicam
- **Linux**: OBS Studio, SimpleScreenRecorder, or Kazam

**Settings:**
- Set screen resolution to 1920x1080 before recording
- Close unnecessary applications
- Hide desktop clutter
- Use a clean browser profile
- Disable notifications

### Audio Recording

- Use a good quality microphone
- Record in a quiet environment
- Speak clearly and at a moderate pace
- Rehearse the narration before recording
- Leave short pauses between sections

### Visual Guidelines

**Terminal/Code Editor:**
- Use a dark theme for better visibility
- Increase font size (minimum 14pt)
- Use color schemes with good contrast
- Clear terminal before important commands

**Browser:**
- Use Chrome or Firefox DevTools (if showing)
- Clear browser console before recording
- Use a clean MetaMask setup
- Zoom browser to 110% for better visibility

**Code Highlighting:**
- Use syntax highlighting
- Highlight changed lines or important code
- Use zoom or close-ups for complex code

## Script Example

Here's a sample narration script:

```
[00:00-00:30] Introduction
"Welcome to the FHEVM SDK demonstration. The FHEVM SDK is a universal,
framework-agnostic software development kit that makes building confidential
frontends with Fully Homomorphic Encryption incredibly simple. It works with
Next.js, React, Vue, or vanilla JavaScript, and provides a wagmi-like API
structure that web3 developers will find familiar."

[00:30-01:15] Next.js Example
"Let's start by looking at our Next.js example. First, we install dependencies
and start the development server. Once loaded, we connect our MetaMask wallet.
The SDK handles all the FHEVM initialization automatically. Now, let's encrypt
some data. I'll enter a number here, and click 'Encrypt with FHE'. As you can
see, the data is encrypted instantly, and we get back encrypted data that can
be used with our smart contracts. The code for this is incredibly simple -
just use the useEncryptedInput hook, and call encrypt. That's it!"

[01:15-02:45] Patent License Example
"Next, let's look at a more complex example - our Confidential Patent Licensing
Platform. This demonstrates a complete production-ready dApp. We've already
deployed the smart contract to Sepolia. Let me register a new patent with
confidential terms. I'll set a royalty rate, minimum fee, and choose to keep
these terms confidential. When I submit, these values are encrypted using FHE,
so they remain private on-chain. Now, let's request a license. I can propose
my own terms, and these are also encrypted. Neither party can see the other's
confidential information without permission. The platform also supports
confidential bidding for exclusive licenses, where bid amounts are completely
hidden until the auction ends."

[02:45-03:15] SDK Features
"The SDK provides a complete set of features: a framework-agnostic core that
works anywhere, optional React hooks for easy integration, a wagmi-like API
that feels familiar to web3 developers, full support for the entire FHE
workflow including initialization, encryption, decryption, and contract
interaction, complete TypeScript support, and multiple production-ready
examples."

[03:15-03:45] Conclusion
"The FHEVM SDK makes building confidential dApps simple and intuitive.
Whether you're building with Next.js, React, or vanilla JavaScript, the SDK
provides everything you need. Check out the GitHub repository for full
documentation, star the project if you find it useful, and try the examples
yourself. Build privacy-preserving applications with confidence using the
FHEVM SDK. Thank you for watching!"
```

## Post-Production

### Editing

- Cut out mistakes or long pauses
- Add smooth transitions between sections
- Include captions/subtitles for key points
- Add background music (optional, keep it subtle)
- Include zoom effects for important details

### Graphics to Add

- Title screen at the beginning
- Feature callouts with text overlays
- Code snippet highlights
- Transaction success animations
- End screen with links

### Compression

If file size exceeds 100MB, use compression:

```bash
# Using ffmpeg
ffmpeg -i input.mp4 -vcodec h264 -acodec aac -b:v 2M -b:a 128k output.mp4
```

Or use online tools like:
- HandBrake (free, open source)
- CloudConvert
- Online-Convert

## Publishing

### File Location

Place the final `demo.mp4` in the root directory:

```
fhevm-react-template/
├── demo.mp4           # Your demo video here
├── README.md
└── ...
```

### Alternative Hosting

If the file is too large for GitHub:

1. **YouTube**
   - Upload to YouTube
   - Add link in README:
     ```markdown
     [Watch Demo Video](https://youtu.be/your-video-id)
     ```

2. **Vimeo**
   - Upload to Vimeo
   - Embed or link in README

3. **Cloud Storage**
   - Google Drive, Dropbox, or OneDrive
   - Make publicly accessible
   - Add link in README

## Checklist

Before finalizing your video:

- [ ] Duration is between 3-5 minutes
- [ ] Resolution is 1920x1080 or higher
- [ ] Audio is clear and audible
- [ ] All examples run without errors
- [ ] Code is readable (proper font size)
- [ ] Transitions are smooth
- [ ] No sensitive information visible
- [ ] File size is reasonable
- [ ] Video plays correctly
- [ ] Captions/subtitles added (optional but recommended)

## Example Videos for Reference

Look at these projects for inspiration:
- wagmi documentation videos
- Ethereum Foundation tutorial videos
- Hardhat tutorial series
- Next.js showcase videos

## Support

If you need help creating the video:
- Check free video editing tutorials on YouTube
- Use online video editors like Kapwing or Clipchamp
- Consider hiring a freelancer on Fiverr for professional editing

---

**Good luck with your demo video! Show the world how easy confidential dApp development can be with FHEVM SDK!**
