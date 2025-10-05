def count_vowels_consonants(s):
    s = s.lower()  # Convert string to lowercase for uniform comparison
    vowels = "aeiou"
    vowel_count = 0
    consonant_count = 0
    
    for char in s:
        if char.isalpha():  # Consider only alphabetic characters
            if char in vowels:
                vowel_count += 1
            else:
                consonant_count += 1
                
    return vowel_count, consonant_count
