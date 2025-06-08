import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  Platform,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import ViewShot from 'react-native-view-shot';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import html2canvas from 'html2canvas';

const TAGS = [
  'business', 'change', 'character', 'competition', 'courage', 'creativity',
  'education', 'faith', 'famous-quotes', 'film', 'freedom', 'friendship',
  'future', 'happiness', 'history', 'honor', 'humor', 'humorous',
  'imagination', 'inspirational', 'leadership', 'life', 'literature',
  'love', 'motivational', 'nature', 'opportunity', 'pain', 'perseverance',
  'philosophy', 'politics', 'power', 'religion', 'sadness', 'science',
  'self', 'self-help', 'social-justice', 'spirituality', 'sports',
  'success', 'technology', 'time', 'truth', 'virtue', 'war',
  'weakness', 'wisdom', 'work'
];

interface Quote {
  content: string;
  author: string;
}

export default function App() {
  const [imageUrl, setImageUrl] = useState('https://picsum.photos/1080/1920');
  const [selectedTag, setSelectedTag] = useState('technology');
  const [quote, setQuote] = useState<Quote | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const viewShotRef = useRef<ViewShot>(null);
  const exportWrapperRef = useRef<HTMLDivElement>(null);

  const generateNewImage = () => {
    setImageUrl(`https://picsum.photos/1080/1920?random=${Date.now()}`);
  };

  const fetchQuote = async (tag: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`https://api.quotable.io/random?tags=${tag}`);
      const data = await response.json();
      setQuote(data);
    } catch (error) {
      console.error('Error fetching quote:', error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchQuote(selectedTag);
  }, [selectedTag]);

  const handleExport = async () => {
    if (!viewShotRef.current || !exportWrapperRef.current) return;
    
    setIsExporting(true);
    try {
      if (Platform.OS === 'web') {
        // For web, we'll use the wrapper div
        const element = exportWrapperRef.current;
        
        // Add a small delay to ensure rendering is complete
        await new Promise(resolve => setTimeout(resolve, 100));

        const canvas = await html2canvas(element, {
          useCORS: true,
          allowTaint: true,
          backgroundColor: '#000000',
          logging: true, // Enable logging for debugging
          scale: window.devicePixelRatio, // Ensure proper scaling
          width: element.offsetWidth,
          height: element.offsetHeight,
        });
        
        // Convert to blob and download
        canvas.toBlob((blob) => {
          if (!blob) {
            throw new Error('Failed to create blob');
          }
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `quote-${Date.now()}.png`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
        }, 'image/png', 1.0);
      } else {
        // Native export using MediaLibrary
        const { status } = await MediaLibrary.requestPermissionsAsync();
        if (status !== 'granted') {
          alert('Sorry, we need camera roll permissions to save the image!');
          return;
        }

        const uri = await viewShotRef.current.capture?.();
        if (!uri) {
          throw new Error('Failed to capture image');
        }
        const asset = await MediaLibrary.createAssetAsync(uri);
        await MediaLibrary.createAlbumAsync('QuoteGenerator', asset, false);
        alert('Image saved to gallery!');
      }
    } catch (error: unknown) {
      console.error('Error exporting image:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      alert(`Failed to save image: ${errorMessage}`);
    }
    setIsExporting(false);
  };

  return (
    <View style={styles.container}>
      <div ref={exportWrapperRef} style={{ width: '90%', maxWidth: 430, aspectRatio: '9/16' }}>
        <ViewShot
          ref={viewShotRef}
          style={styles.imageContainer}
          options={{
            format: 'png',
            quality: 1,
          }}
          data-testid="view-shot"
        >
          <Image
            source={{ uri: imageUrl }}
            style={styles.backgroundImage}
          />
          <View style={styles.quoteContainer}>
            {isLoading ? (
              <ActivityIndicator size="large" color="#ffffff" />
            ) : quote ? (
              <View style={styles.quoteBox}>
                <Text style={styles.quoteText}>{quote.content}</Text>
                <Text style={styles.authorText}>- {quote.author}</Text>
              </View>
            ) : null}
          </View>
        </ViewShot>
      </div>

      <View style={styles.controlsContainer}>
        <View style={styles.topButtonsContainer}>
          <View style={styles.pickerContainer}>
            <View style={styles.nativePickerWrapper}>
              <Picker
                selectedValue={selectedTag}
                onValueChange={setSelectedTag}
                style={styles.nativePicker}
                dropdownIconColor="#000000"
              >
                {TAGS.map(tag => (
                  <Picker.Item
                    label={tag.charAt(0).toUpperCase() + tag.slice(1).replace(/-/g, ' ')}
                    value={tag}
                    key={tag}
                  />
                ))}
              </Picker>
            </View>
          </View>

          <TouchableOpacity
            onPress={() => fetchQuote(selectedTag)}
            style={[styles.button, styles.refreshButton]}
          >
            <Text style={styles.buttonText}>New Quote</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={generateNewImage}
            style={[styles.button, styles.backgroundButton]}
          >
            <Text style={styles.buttonText}>Change Background</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={handleExport}
          disabled={isExporting}
          style={[styles.button, styles.exportButton, styles.exportButtonContainer]}
        >
          {isExporting ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text style={[styles.buttonText, styles.exportButtonText]}>Export</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageContainer: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  quoteContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  quoteBox: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 16,
    borderRadius: 8,
    width: '90%',
  },
  quoteText: {
    color: '#ffffff',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 8,
  },
  authorText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    textAlign: 'center',
  },
  controlsContainer: {
    position: 'absolute',
    bottom: 40,
    width: '90%',
    maxWidth: 430,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 16,
    padding: 20,
  },
  topButtonsContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
    alignItems: 'center',
  },
  pickerContainer: {
    flex: 2,
    position: 'relative',
  },
  nativePickerWrapper: {
    borderRadius: 8,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.2)',
    overflow: 'hidden',
    height: 44,
    justifyContent: 'center',
    position: 'relative',
  },
  nativePicker: {
    color: '#000000',
    height: 44,
    fontSize: 14,
    fontWeight: '600',
    width: '100%',
    paddingLeft: 8,
    paddingRight: 32,
  },
  button: {
    flex: 1,
    height: 44,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  refreshButton: {
    backgroundColor: '#4CAF50',
  },
  backgroundButton: {
    backgroundColor: '#ffffff',
  },
  exportButton: {
    backgroundColor: '#3b82f6',
  },
  exportButtonContainer: {
    width: '100%',
  },
  buttonText: {
    color: '#000000',
    fontSize: 14,
    fontWeight: '600',
  },
  exportButtonText: {
    color: '#ffffff',
  },
});
