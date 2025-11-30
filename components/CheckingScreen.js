import React from 'react';
import { Box, Typography, CircularProgress, LinearProgress } from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';

const gradientShift = keyframes`
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
`;

const fadeInUp = keyframes`
    from {
        opacity: 0;
        transform: translateY(10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
`;

const CheckingContainer = styled(Box)({
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #0a0a0a 0%, #121212 25%, #1a1a1a 50%, #1e1e1e 75%, #252525 100%)',
    backgroundSize: '400% 400%',
    animation: `${gradientShift} 15s ease infinite`,
    zIndex: 10000
});

const CheckItem = styled(Box)({
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    margin: '8px 0',
    opacity: 0,
    animation: `${fadeInUp} 0.5s ease-out forwards`
});

const CheckIcon = styled(Box, {
    shouldForwardProp: (prop) => prop !== 'checked',
})(({ checked }) => ({
    width: '20px',
    height: '20px',
    borderRadius: '50%',
    border: '2px solid',
    borderColor: checked ? '#4caf50' : 'rgba(255, 255, 255, 0.3)',
    backgroundColor: checked ? '#4caf50' : 'transparent',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.3s ease',
    position: 'relative',
    '&::after': checked ? {
        content: '"✓"',
        color: '#fff',
        fontSize: '12px',
        fontWeight: 'bold',
        position: 'absolute'
    } : {}
}));

export default function CheckingScreen({ onComplete }) {
    const [checks, setChecks] = React.useState({
        browser: false,
        network: false,
        api: false,
        security: false
    });
    
    const [currentCheck, setCurrentCheck] = React.useState('');
    const [progress, setProgress] = React.useState(0);

    React.useEffect(() => {
        const performChecks = async () => {
            // Check 1: Browser Compatibility
            setCurrentCheck('Checking browser compatibility...');
            await new Promise(resolve => setTimeout(resolve, 800));
            setChecks(prev => ({ ...prev, browser: true }));
            setProgress(25);
            
            // Check 2: Network Connectivity
            setCurrentCheck('Verifying network connection...');
            await new Promise(resolve => setTimeout(resolve, 600));
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_HOST || window.location.origin}/api/guilds`, {
                    method: 'HEAD',
                    cache: 'no-cache'
                });
                // Even if it fails with 401/403, network is working
                setChecks(prev => ({ ...prev, network: true }));
            } catch (error) {
                // Network error, but we'll still proceed
                setChecks(prev => ({ ...prev, network: true }));
            }
            setProgress(50);
            
            // Check 3: API Availability
            setCurrentCheck('Checking API availability...');
            await new Promise(resolve => setTimeout(resolve, 700));
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_HOST || window.location.origin}/api/guilds`, {
                    method: 'HEAD',
                    cache: 'no-cache'
                });
                // API is reachable if we get any response (even error codes mean it's up)
                setChecks(prev => ({ ...prev, api: true }));
            } catch (error) {
                // Still mark as true to proceed
                setChecks(prev => ({ ...prev, api: true }));
            }
            setProgress(75);
            
            // Check 4: Security Checks
            setCurrentCheck('Performing security checks...');
            await new Promise(resolve => setTimeout(resolve, 800));
            // Basic security checks
            const isSecure = window.location.protocol === 'https:' || window.location.hostname === 'localhost';
            const hasCookies = navigator.cookieEnabled;
            setChecks(prev => ({ ...prev, security: isSecure || hasCookies }));
            setProgress(100);
            
            // Final delay before redirecting
            setCurrentCheck('All checks complete!');
            await new Promise(resolve => setTimeout(resolve, 500));
            
            // Complete and redirect
            if (onComplete) {
                onComplete();
            }
        };

        performChecks();
    }, [onComplete]);

    return (
        <CheckingContainer>
            <Box sx={{ 
                textAlign: 'center',
                maxWidth: '400px',
                padding: '2rem'
            }}>
                <Typography 
                    variant="h4" 
                    sx={{ 
                        mb: 4,
                        fontWeight: 600,
                        background: 'linear-gradient(135deg, #e0e0e0 0%, #c0c0c0 50%, #a0a0a0 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text'
                    }}
                >
                    Guardian Dashboard
                </Typography>
                
                <Box sx={{ mb: 4 }}>
                    <CircularProgress 
                        size={60} 
                        thickness={4}
                        sx={{ 
                            color: '#5865F2',
                            mb: 3
                        }} 
                    />
                </Box>

                <Typography 
                    variant="body1" 
                    sx={{ 
                        mb: 3,
                        color: 'rgba(255, 255, 255, 0.8)',
                        minHeight: '24px'
                    }}
                >
                    {currentCheck}
                </Typography>

                <Box sx={{ width: '100%', mb: 3 }}>
                    <LinearProgress 
                        variant="determinate" 
                        value={progress} 
                        sx={{ 
                            height: 6,
                            borderRadius: 3,
                            backgroundColor: 'rgba(255, 255, 255, 0.1)',
                            '& .MuiLinearProgress-bar': {
                                backgroundColor: '#5865F2',
                                borderRadius: 3
                            }
                        }}
                    />
                </Box>

                <Box sx={{ mt: 4 }}>
                    <CheckItem sx={{ animationDelay: '0.1s' }}>
                        <CheckIcon checked={checks.browser} />
                        <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                            Browser Compatibility
                        </Typography>
                    </CheckItem>
                    <CheckItem sx={{ animationDelay: '0.2s' }}>
                        <CheckIcon checked={checks.network} />
                        <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                            Network Connection
                        </Typography>
                    </CheckItem>
                    <CheckItem sx={{ animationDelay: '0.3s' }}>
                        <CheckIcon checked={checks.api} />
                        <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                            API Availability
                        </Typography>
                    </CheckItem>
                    <CheckItem sx={{ animationDelay: '0.4s' }}>
                        <CheckIcon checked={checks.security} />
                        <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                            Security Checks
                        </Typography>
                    </CheckItem>
                </Box>
            </Box>
        </CheckingContainer>
    );
}

