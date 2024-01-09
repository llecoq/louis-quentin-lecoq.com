#!/bin/bash

# Set the language for commands to English
export LANG=C
export LC_ALL=C

# Create or overwrite a file to store the information
output_file="environment_info.txt"
> $output_file

# Function to add information to the file
add_info () {
    echo "$1" >> $output_file
    echo "$2" >> $output_file
    echo "" >> $output_file
}

# Operating System
add_info "Operating System:" "$(lsb_release -a 2>/dev/null || cat /etc/os-release)"

# CPU
add_info "CPU Information:" "$(lscpu)"

# Memory
add_info "Memory:" "$(free -h)"

# Disk Space
add_info "Disk Space:" "$(df -h 2>&1 | grep -v 'Operation not permitted')"

# GPU (if available)
if command -v nvidia-smi &> /dev/null
then
    add_info "GPU Information (NVIDIA):" "$(nvidia-smi)"
else
    add_info "GPU Information (Other):" "$(lspci | grep VGA)"
fi

# Node.js (if available)
if command -v node &> /dev/null
then
    add_info "Node.js Version:" "$(node --version)"
fi

# Rust (if available)
if command -v rustc &> /dev/null && command -v cargo &> /dev/null
then
    add_info "Rust and Cargo Version:" "$(rustc --version)\n$(cargo --version)"
fi

# Display the path of the file containing the results
echo "Environment information has been saved in $output_file"
